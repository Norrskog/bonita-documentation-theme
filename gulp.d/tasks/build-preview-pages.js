'use strict'

// NOTE remove patch after upgrading from asciidoctor.js to @asciidoctor/core
Error.call = (self, ...args) => {
  const err = new Error(...args)
  return Object.assign(self, { message: err.message, stack: err.stack })
}

const asciidoctor = require('asciidoctor')()
const fs = require('fs-extra')
const handlebars = require('handlebars')
const { obj: map } = require('through2')
const merge = require('merge-stream')
const ospath = require('path')
const path = ospath.posix
const requireFromString = require('require-from-string')
const vfs = require('vinyl-fs')
const yaml = require('js-yaml')

const ASCIIDOC_ATTRIBUTES = { experimental: '', icons: 'font', sectanchors: '', 'source-highlighter': 'highlight.js' }

module.exports = (src, previewSrc, previewDest, sink = () => map()) => (done) =>
  Promise.all([
    loadSampleUiModel(previewSrc),
    toPromise(
      merge(compileLayouts(src), registerPartials(src), registerHelpers(src), copyImages(previewSrc, previewDest))
    ),
  ])
    .then(([baseUiModel, { layouts }]) => [{ ...baseUiModel, env: process.env }, layouts])
    .then(([baseUiModel, layouts]) => {
      // CUSTOM bonita-theme
      // let override the site.url defined in uid-model.yml with an environment variable
      const siteUrl = process.env.BONITA_THEME_URL
      if (siteUrl) {
        console.info('Overriding site url from %s to %s', baseUiModel.site.url, siteUrl)
        baseUiModel.site.url = siteUrl
      }
      // end of - CUSTOM bonita-theme
      vfs
        .src('**/*.adoc', { base: previewSrc, cwd: previewSrc })
        .pipe(
          map((file, enc, next) => {
            const siteRootPath = path.relative(ospath.dirname(file.path), ospath.resolve(previewSrc))
            const uiModel = { ...baseUiModel }
            uiModel.page = { ...uiModel.page }
            uiModel.siteRootPath = siteRootPath
            uiModel.siteRootUrl = path.join(siteRootPath, 'index.html')
            uiModel.uiRootPath = path.join(siteRootPath, '_')
            if (file.stem === '404') {
              uiModel.page = { layout: '404', title: 'Page Not Found' }
            } else {
              // CUSTOM bonita-theme
              // get rid of the hard coded url, and target the actual url to make the navbar opened to the right page
              uiModel.page.url = `/bonita/dev/${file.stem}.html`
              // end of - CUSTOM bonita-theme
              const doc = asciidoctor.load(file.contents, { safe: 'safe', attributes: ASCIIDOC_ATTRIBUTES })
              uiModel.page.attributes = Object.entries(doc.getAttributes())
                .filter(([name, val]) => name.startsWith('page-'))
                .reduce((accum, [name, val]) => {
                  accum[name.substr(5)] = val
                  return accum
                }, {})
              uiModel.page.layout = doc.getAttribute('page-layout', 'default')
              uiModel.page.title = doc.getDocumentTitle()
              uiModel.page.contents = Buffer.from(doc.convert())
            }
            file.extname = '.html'
            try {
              file.contents = Buffer.from(layouts.get(uiModel.page.layout)(uiModel))
              next(null, file)
            } catch (e) {
              next(transformHandlebarsError(e, uiModel.page.layout))
            }
          })
        )
        .pipe(vfs.dest(previewDest))
        .on('error', (e) => done)
        .pipe(sink())
    })

function loadSampleUiModel (src) {
  return fs.readFile(ospath.join(src, 'ui-model.yml'), 'utf8').then((contents) => yaml.safeLoad(contents))
}

function registerPartials (src) {
  return vfs.src('partials/*.hbs', { base: src, cwd: src }).pipe(
    map((file, enc, next) => {
      handlebars.registerPartial(file.stem, file.contents.toString())
      next()
    })
  )
}

function registerHelpers (src) {
  handlebars.registerHelper('resolvePage', resolvePage)
  handlebars.registerHelper('resolvePageURL', resolvePageURL)
  handlebars.registerHelper('isApiComponent', isApiComponent)
  return vfs.src('helpers/*.js', { base: src, cwd: src }).pipe(
    map((file, enc, next) => {
      handlebars.registerHelper(file.stem, requireFromString(file.contents.toString()))
      next()
    })
  )
}

function compileLayouts (src) {
  const layouts = new Map()
  return vfs.src('layouts/*.hbs', { base: src, cwd: src }).pipe(
    map(
      (file, enc, next) => {
        const srcName = path.join(src, file.relative)
        layouts.set(file.stem, handlebars.compile(file.contents.toString(), { preventIndent: true, srcName }))
        next()
      },
      function (done) {
        this.push({ layouts })
        done()
      }
    )
  )
}

function copyImages (src, dest) {
  return vfs
    .src('**/*.{png,svg,cast}', { base: src, cwd: src })
    .pipe(vfs.dest(dest))
    .pipe(map((file, enc, next) => next()))
}

function resolvePage (spec, context = {}) {
  if (spec) return { pub: { url: resolvePageURL(spec) } }
}

function resolvePageURL (spec, context = {}) {
  if (spec) return '/' + (spec = spec.split(':').pop()).slice(0, spec.lastIndexOf('.')) + '.html'
}

function isApiComponent (value) {
  console.log('Component: ' + value)
  return value !== 'Bonita REST API'
}

function transformHandlebarsError ({ message, stack }, layout) {
  const m = stack.match(/^ *at Object\.ret \[as (.+?)\]/m)
  const templatePath = `src/${m ? 'partials/' + m[1] : 'layouts/' + layout}.hbs`
  const err = new Error(`${message}${~message.indexOf('\n') ? '\n^ ' : ' '}in UI template ${templatePath}`)
  err.stack = [err.toString()].concat(stack.substr(message.length + 8)).join('\n')
  return err
}

function toPromise (stream) {
  return new Promise((resolve, reject, data = {}) =>
    stream
      .on('error', reject)
      .on('data', (chunk) => chunk.constructor === Object && Object.assign(data, chunk))
      .on('finish', () => resolve(data))
  )
}
