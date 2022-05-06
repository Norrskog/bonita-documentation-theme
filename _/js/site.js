!function(){"use strict";var s=/^sect(\d)$/,n=document.querySelector(".nav-container"),i=document.querySelector(".nav-toggle");i.addEventListener("click",function(e){if(i.classList.contains("is-active"))return u(e);var t=document.documentElement;t.classList.add("is-clipped--nav"),i.classList.add("is-active"),n.classList.add("is-active"),t.addEventListener("click",u),v(e)}),n.addEventListener("click",v);var c,r,o,l=n.querySelector("[data-panel=menu]");function e(){var e,t,n=window.location.hash;if(n&&(n.indexOf("%")&&(n=decodeURIComponent(n)),!(e=l.querySelector('.nav-link[href="'+n+'"]')))){n=document.getElementById(n.slice(1));if(n)for(var i=n,a=document.querySelector("article.doc");(i=i.parentNode)&&i!==a;){var c=i.id;if((c=!c&&(c=i.className.match(s))?(i.firstElementChild||{}).id:c)&&(e=l.querySelector('.nav-link[href="#'+c+'"]')))break}}if(e)t=e.parentNode;else{if(!o)return;e=(t=o).querySelector(".nav-link")}t!==r&&(f(l,".nav-item.is-active").forEach(function(e){e.classList.remove("is-active","is-current-path","is-current-page")}),t.classList.add("is-current-page"),d(r=t),m(l,e))}function d(e){for(var t,n=e.parentNode;!(t=n.classList).contains("nav-menu");)"LI"===n.tagName&&t.contains("nav-item")&&t.add("is-active","is-current-path"),n=n.parentNode;e.classList.add("is-active")}function a(){this.classList.toggle("is-active")}function u(e){var t=document.documentElement;t.classList.remove("is-clipped--nav"),i.classList.remove("is-active"),n.classList.remove("is-active"),t.removeEventListener("click",u),v(e)}function v(e){e.stopPropagation()}function m(e,t){var n=e.getBoundingClientRect(),i=n.height,a=window.getComputedStyle(c);"sticky"===a.position&&(i-=n.top-parseFloat(a.top)),e.scrollTop=Math.max(0,.5*(t.getBoundingClientRect().height-i)+t.offsetTop)}function f(e,t){return[].slice.call(e.querySelectorAll(t))}l&&(c=n.querySelector(".nav"),r=l.querySelector(".is-current-page"),(o=r)?(d(r),m(l,r.querySelector(".nav-link"))):l.scrollTop=0,f(l,".nav-item-toggle").forEach(function(e){var t=e.parentElement;e.addEventListener("click",a.bind(t));e=function(e,t){e=e.nextElementSibling;return e?(!t||e[e.matches?"matches":"msMatchesSelector"](t))&&e:void 0}(e,".nav-text");e&&(e.style.cursor="pointer",e.addEventListener("click",a.bind(t)))}),c.querySelector(".context").addEventListener("click",function(){var e=c.querySelector(".is-active[data-panel]"),t="menu"===e.dataset.panel?"explore":"menu";e.classList.toggle("is-active"),c.querySelector("[data-panel="+t+"]").classList.toggle("is-active")}),l.addEventListener("mousedown",function(e){1<e.detail&&e.preventDefault()}),l.querySelector('.nav-link[href^="#"]')&&(window.location.hash&&e(),window.addEventListener("hashchange",e)))}();
!function(){"use strict";var e=document.querySelector("aside.toc.sidebar");if(e){if(document.querySelector("body.-toc"))return e.parentNode.removeChild(e);var t=parseInt(e.dataset.levels||2);if(!(t<0)){for(var d,c,a=document.querySelector("article.doc"),o=[],n=0;n<=t;n++)o.push(n?".sect"+n+">h"+(n+1)+"[id]":"h1[id].sect0");if(r=o.join(","),i=a,!(d=[].slice.call((i||document).querySelectorAll(r))).length)return e.parentNode.removeChild(e);var s={},l=d.reduce(function(e,t){var o=document.createElement("a");o.textContent=t.textContent,s[o.href="#"+t.id]=o;var n=document.createElement("li");return n.dataset.level=parseInt(t.nodeName.slice(1))-1,n.appendChild(o),e.appendChild(n),e},document.createElement("ul")),i=e.querySelector(".toc-menu");i||((i=document.createElement("div")).className="toc-menu");var r=document.createElement("h3");r.textContent=e.dataset.title||"Contents",i.appendChild(r),i.appendChild(l);e=!document.getElementById("toc")&&a.querySelector("h1.page ~ :not(.is-before-toc)");e&&((r=document.createElement("aside")).className="toc embedded",r.appendChild(i.cloneNode(!0)),e.parentNode.insertBefore(r,e)),window.addEventListener("load",function(){u(),window.addEventListener("scroll",u)})}}function u(){var t,e=window.pageYOffset,o=1.15*m(document.documentElement,"fontSize"),n=a.offsetTop;if(e&&window.innerHeight+e+2>=document.documentElement.scrollHeight){c=Array.isArray(c)?c:Array(c||0);var i=[],r=d.length-1;return d.forEach(function(e,t){var o="#"+e.id;t===r||e.getBoundingClientRect().top+m(e,"paddingTop")>n?(i.push(o),c.indexOf(o)<0&&s[o].classList.add("is-active")):~c.indexOf(o)&&s[c.shift()].classList.remove("is-active")}),l.scrollTop=l.scrollHeight-l.offsetHeight,void(c=1<i.length?i:i[0])}Array.isArray(c)&&(c.forEach(function(e){s[e].classList.remove("is-active")}),c=void 0),d.some(function(e){return e.getBoundingClientRect().top+m(e,"paddingTop")-o>n||void(t="#"+e.id)}),t?t!==c&&(c&&s[c].classList.remove("is-active"),(e=s[t]).classList.add("is-active"),l.scrollHeight>l.offsetHeight&&(l.scrollTop=Math.max(0,e.offsetTop+e.offsetHeight-l.offsetHeight)),c=t):c&&(s[c].classList.remove("is-active"),c=void 0)}function m(e,t){return parseFloat(window.getComputedStyle(e)[t])}}();
!function(){"use strict";var o=document.querySelector("article.doc"),t=document.querySelector(".toolbar");function i(e){return e&&(~e.indexOf("%")?decodeURIComponent(e):e).slice(1)}function c(e){e&&(window.location.hash="#"+this.id,e.preventDefault()),window.scrollTo(0,function e(t,n){return o.contains(t)?e(t.offsetParent,t.offsetTop+n):n}(this,0)-t.getBoundingClientRect().bottom)}window.addEventListener("load",function e(t){var n,o;(n=i(window.location.hash))&&(o=document.getElementById(n))&&(c.bind(o)(),setTimeout(c.bind(o),0)),window.removeEventListener("load",e)}),Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function(e){var t,n;(t=i(e.hash))&&(n=document.getElementById(t))&&e.addEventListener("click",c.bind(n))})}();
!function(){"use strict";var t,e=document.querySelector(".page-versions .version-menu-toggle");e&&(t=document.querySelector(".page-versions"),e.addEventListener("click",function(e){t.classList.toggle("is-active"),e.stopPropagation()}),document.documentElement.addEventListener("click",function(){t.classList.remove("is-active")}))}();
document.addEventListener("DOMContentLoaded",function(){var t=Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"),0);0!==t.length&&t.forEach(function(e){e.addEventListener("click",function(t){t.stopPropagation(),e.classList.toggle("is-active"),document.getElementById(e.dataset.target).classList.toggle("is-active"),document.documentElement.classList.toggle("is-clipped--navbar")})})});
!function(){"use strict";var s=/^\$ (\S[^\\\n]*(\\\n(?!\$ )[^\\\n]*)*)(?=\n|$)/gm,l=/( ) *\\\n *|\\\n( ?) */g,d=/ +$/gm,r=(document.getElementById("site-script")||{dataset:{}}).dataset;[].slice.call(document.querySelectorAll(".doc pre.highlight, .doc .literalblock pre")).forEach(function(e){var t,n,c,i,a;if(e.classList.contains("highlight"))(c=(t=e.querySelector("code")).dataset.lang)&&"console"!==c&&((i=document.createElement("span")).className="source-lang",i.appendChild(document.createTextNode(c)));else{if(!e.innerText.startsWith("$ "))return;var o=e.parentNode.parentNode;o.classList.remove("literalblock"),o.classList.add("listingblock"),e.classList.add("highlightjs","highlight"),(t=document.createElement("code")).className="language-console hljs",t.dataset.lang="console",t.appendChild(e.firstChild),e.appendChild(t)}(c=document.createElement("div")).className="source-toolbox",i&&c.appendChild(i),window.navigator.clipboard&&((n=document.createElement("button")).className="copy-button",n.setAttribute("title","Copy to clipboard"),"svg"===r.svgAs?((o=document.createElementNS("http://www.w3.org/2000/svg","svg")).setAttribute("class","copy-icon"),(i=document.createElementNS("http://www.w3.org/2000/svg","use")).setAttribute("href",window.uiRootPath+"/img/octicons-16.svg#icon-clippy"),o.appendChild(i),n.appendChild(o)):((a=document.createElement("img")).src=window.uiRootPath+"/img/octicons-16.svg#view-clippy",a.alt="copy icon",a.className="copy-icon",n.appendChild(a)),(a=document.createElement("span")).className="copy-toast",a.appendChild(document.createTextNode("Copied!")),n.appendChild(a),c.appendChild(n)),e.appendChild(c),n&&n.addEventListener("click",function(e){var t=e.innerText.replace(d,"");"console"===e.dataset.lang&&t.startsWith("$ ")&&(t=function(e){var t,n=[];for(;t=s.exec(e);)n.push(t[1].replace(l,"$1$2"));return n.join(" && ")}(t));window.navigator.clipboard.writeText(t).then(function(){this.classList.add("clicked"),this.offsetHeight,this.classList.remove("clicked")}.bind(this),function(){})}.bind(n,t))})}();
function sendClickEvent(e,t,n){var o,c;for(let e=0;e<t.length;e++){var r=t[e];if(r.url===n.url){o=e+1,c=r.objectID;break}}aa("clickedObjectIDsAfterSearch",{userToken:"bonitadoc",eventName:"Search suggestion selected",index:"bonitasoft",queryID:e,objectIDs:[c],positions:[o]})}
//# sourceMappingURL=site.js.map