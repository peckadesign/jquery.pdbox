/**
 * jQuery pdBox - pdBox is thickbox-like jQuery plugin developed in PeckaDesign 
 * https://github.com/peckadesign/jquery.pdbox
 *
 * @author PeckaDesign, s.r.o <support@peckadesign.cz>
 * @copyright Copyright (c) 2014-2025 PeckaDesign, s.r.o
 * @license MIT
 *
 * @version 2.0.0
 */
/*!
* tabbable 5.3.3
* @license MIT, https://github.com/focus-trap/tabbable/blob/master/LICENSE
*/
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):(e="undefined"!=typeof globalThis?globalThis:e||self,function(){var n=e.tabbable,o=e.tabbable={};t(o),o.noConflict=function(){return e.tabbable=n,o}}())}(this,(function(e){"use strict";var t=["input","select","textarea","a[href]","button","[tabindex]:not(slot)","audio[controls]","video[controls]",'[contenteditable]:not([contenteditable="false"])',"details>summary:first-of-type","details"],n=t.join(","),o="undefined"==typeof Element,r=o?function(){}:Element.prototype.matches||Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector,i=!o&&Element.prototype.getRootNode?function(e){return e.getRootNode()}:function(e){return e.ownerDocument},a=function(e,t,o){var i=Array.prototype.slice.apply(e.querySelectorAll(n));return t&&r.call(e,n)&&i.unshift(e),i=i.filter(o)},l=function e(t,o,i){for(var a=[],l=Array.from(t);l.length;){var u=l.shift();if("SLOT"===u.tagName){var c=u.assignedElements(),d=e(c.length?c:u.children,!0,i);i.flatten?a.push.apply(a,d):a.push({scope:u,candidates:d})}else{r.call(u,n)&&i.filter(u)&&(o||!t.includes(u))&&a.push(u);var f=u.shadowRoot||"function"==typeof i.getShadowRoot&&i.getShadowRoot(u),s=!i.shadowRootFilter||i.shadowRootFilter(u);if(f&&s){var p=e(!0===f?u.children:f.children,!0,i);i.flatten?a.push.apply(a,p):a.push({scope:u,candidates:p})}else l.unshift.apply(l,u.children)}}return a},u=function(e,t){return e.tabIndex<0&&(t||/^(AUDIO|VIDEO|DETAILS)$/.test(e.tagName)||e.isContentEditable)&&isNaN(parseInt(e.getAttribute("tabindex"),10))?0:e.tabIndex},c=function(e,t){return e.tabIndex===t.tabIndex?e.documentOrder-t.documentOrder:e.tabIndex-t.tabIndex},d=function(e){return"INPUT"===e.tagName},f=function(e){return function(e){return d(e)&&"radio"===e.type}(e)&&!function(e){if(!e.name)return!0;var t,n=e.form||i(e),o=function(e){return n.querySelectorAll('input[type="radio"][name="'+e+'"]')};if("undefined"!=typeof window&&void 0!==window.CSS&&"function"==typeof window.CSS.escape)t=o(window.CSS.escape(e.name));else try{t=o(e.name)}catch(e){return console.error("Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s",e.message),!1}var r=function(e,t){for(var n=0;n<e.length;n++)if(e[n].checked&&e[n].form===t)return e[n]}(t,e.form);return!r||r===e}(e)},s=function(e){var t=e.getBoundingClientRect(),n=t.width,o=t.height;return 0===n&&0===o},p=function(e,t){return!(t.disabled||function(e){return d(e)&&"hidden"===e.type}(t)||function(e,t){var n=t.displayCheck,o=t.getShadowRoot;if("hidden"===getComputedStyle(e).visibility)return!0;var a=r.call(e,"details>summary:first-of-type")?e.parentElement:e;if(r.call(a,"details:not([open]) *"))return!0;var l=i(e).host,u=(null==l?void 0:l.ownerDocument.contains(l))||e.ownerDocument.contains(e);if(n&&"full"!==n){if("non-zero-area"===n)return s(e)}else{if("function"==typeof o){for(var c=e;e;){var d=e.parentElement,f=i(e);if(d&&!d.shadowRoot&&!0===o(d))return s(e);e=e.assignedSlot?e.assignedSlot:d||f===e.ownerDocument?d:f.host}e=c}if(u)return!e.getClientRects().length}return!1}(t,e)||function(e){return"DETAILS"===e.tagName&&Array.prototype.slice.apply(e.children).some((function(e){return"SUMMARY"===e.tagName}))}(t)||function(e){if(/^(INPUT|BUTTON|SELECT|TEXTAREA)$/.test(e.tagName))for(var t=e.parentElement;t;){if("FIELDSET"===t.tagName&&t.disabled){for(var n=0;n<t.children.length;n++){var o=t.children.item(n);if("LEGEND"===o.tagName)return!!r.call(t,"fieldset[disabled] *")||!o.contains(e)}return!0}t=t.parentElement}return!1}(t))},h=function(e,t){return!(f(t)||u(t)<0||!p(e,t))},b=function(e){var t=parseInt(e.getAttribute("tabindex"),10);return!!(isNaN(t)||t>=0)},m=t.concat("iframe").join(",");e.focusable=function(e,t){return(t=t||{}).getShadowRoot?l([e],t.includeContainer,{filter:p.bind(null,t),flatten:!0,getShadowRoot:t.getShadowRoot}):a(e,t.includeContainer,p.bind(null,t))},e.isFocusable=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return!1!==r.call(e,m)&&p(t,e)},e.isTabbable=function(e,t){if(t=t||{},!e)throw new Error("No node provided");return!1!==r.call(e,n)&&h(t,e)},e.tabbable=function(e,t){return function e(t){var n=[],o=[];return t.forEach((function(t,r){var i=!!t.scope,a=i?t.scope:t,l=u(a,i),c=i?e(t.candidates):a;0===l?i?n.push.apply(n,c):n.push(a):o.push({documentOrder:r,tabIndex:l,item:t,isScope:i,content:c})})),o.sort(c).reduce((function(e,t){return t.isScope?e.push.apply(e,t.content):e.push(t.content),e}),[]).concat(n)}((t=t||{}).getShadowRoot?l([e],t.includeContainer,{filter:h.bind(null,t),flatten:!1,getShadowRoot:t.getShadowRoot,shadowRootFilter:b}):a(e,t.includeContainer,h.bind(null,t)))},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=index.umd.min.js.map

/*!
* focus-trap 6.9.4
* @license MIT, https://github.com/focus-trap/focus-trap/blob/master/LICENSE
*/
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports,require("tabbable")):"function"==typeof define&&define.amd?define(["exports","tabbable"],t):(e="undefined"!=typeof globalThis?globalThis:e||self,function(){var n=e.focusTrap,a=e.focusTrap={};t(a,e.tabbable),a.noConflict=function(){return e.focusTrap=n,a}}())}(this,(function(e,t){"use strict";function n(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function a(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var r,i=(r=[],{activateTrap:function(e){if(r.length>0){var t=r[r.length-1];t!==e&&t.pause()}var n=r.indexOf(e);-1===n||r.splice(n,1),r.push(e)},deactivateTrap:function(e){var t=r.indexOf(e);-1!==t&&r.splice(t,1),r.length>0&&r[r.length-1].unpause()}}),c=function(e){return setTimeout(e,0)},u=function(e,t){var n=-1;return e.every((function(e,a){return!t(e)||(n=a,!1)})),n},s=function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];return"function"==typeof e?e.apply(void 0,n):e},l=function(e){return e.target.shadowRoot&&"function"==typeof e.composedPath?e.composedPath()[0]:e.target};e.createFocusTrap=function(e,n){var o,r=(null==n?void 0:n.document)||document,b=a({returnFocusOnDeactivate:!0,escapeDeactivates:!0,delayInitialFocus:!0},n),f={containers:[],containerGroups:[],tabbableGroups:[],nodeFocusedBeforeActivation:null,mostRecentlyFocusedNode:null,active:!1,paused:!1,delayInitialFocusTimer:void 0},v=function(e,t,n){return e&&void 0!==e[t]?e[t]:b[n||t]},d=function(e){return f.containerGroups.findIndex((function(t){var n=t.container,a=t.tabbableNodes;return n.contains(e)||a.find((function(t){return t===e}))}))},p=function(e){var t=b[e];if("function"==typeof t){for(var n=arguments.length,a=new Array(n>1?n-1:0),o=1;o<n;o++)a[o-1]=arguments[o];t=t.apply(void 0,a)}if(!0===t&&(t=void 0),!t){if(void 0===t||!1===t)return t;throw new Error("`".concat(e,"` was specified but was not a node, or did not return a node"))}var i=t;if("string"==typeof t&&!(i=r.querySelector(t)))throw new Error("`".concat(e,"` as selector refers to no known node"));return i},h=function(){var e=p("initialFocus");if(!1===e)return!1;if(void 0===e)if(d(r.activeElement)>=0)e=r.activeElement;else{var t=f.tabbableGroups[0];e=t&&t.firstTabbableNode||p("fallbackFocus")}if(!e)throw new Error("Your focus-trap needs to have at least one focusable element");return e},y=function(){if(f.containerGroups=f.containers.map((function(e){var n=t.tabbable(e,b.tabbableOptions),a=t.focusable(e,b.tabbableOptions);return{container:e,tabbableNodes:n,focusableNodes:a,firstTabbableNode:n.length>0?n[0]:null,lastTabbableNode:n.length>0?n[n.length-1]:null,nextTabbableNode:function(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],o=a.findIndex((function(t){return t===e}));if(!(o<0))return n?a.slice(o+1).find((function(e){return t.isTabbable(e,b.tabbableOptions)})):a.slice(0,o).reverse().find((function(e){return t.isTabbable(e,b.tabbableOptions)}))}}})),f.tabbableGroups=f.containerGroups.filter((function(e){return e.tabbableNodes.length>0})),f.tabbableGroups.length<=0&&!p("fallbackFocus"))throw new Error("Your focus-trap must have at least one container with at least one tabbable node in it at all times")},m=function e(t){!1!==t&&t!==r.activeElement&&(t&&t.focus?(t.focus({preventScroll:!!b.preventScroll}),f.mostRecentlyFocusedNode=t,function(e){return e.tagName&&"input"===e.tagName.toLowerCase()&&"function"==typeof e.select}(t)&&t.select()):e(h()))},O=function(e){var t=p("setReturnFocus",e);return t||!1!==t&&e},g=function(e){var n=l(e);d(n)>=0||(s(b.clickOutsideDeactivates,e)?o.deactivate({returnFocus:b.returnFocusOnDeactivate&&!t.isFocusable(n,b.tabbableOptions)}):s(b.allowOutsideClick,e)||e.preventDefault())},T=function(e){var t=l(e),n=d(t)>=0;n||t instanceof Document?n&&(f.mostRecentlyFocusedNode=t):(e.stopImmediatePropagation(),m(f.mostRecentlyFocusedNode||h()))},F=function(e){if(function(e){return"Escape"===e.key||"Esc"===e.key||27===e.keyCode}(e)&&!1!==s(b.escapeDeactivates,e))return e.preventDefault(),void o.deactivate();(function(e){return"Tab"===e.key||9===e.keyCode})(e)&&function(e){var n=l(e);y();var a=null;if(f.tabbableGroups.length>0){var o=d(n),r=o>=0?f.containerGroups[o]:void 0;if(o<0)a=e.shiftKey?f.tabbableGroups[f.tabbableGroups.length-1].lastTabbableNode:f.tabbableGroups[0].firstTabbableNode;else if(e.shiftKey){var i=u(f.tabbableGroups,(function(e){var t=e.firstTabbableNode;return n===t}));if(i<0&&(r.container===n||t.isFocusable(n,b.tabbableOptions)&&!t.isTabbable(n,b.tabbableOptions)&&!r.nextTabbableNode(n,!1))&&(i=o),i>=0){var c=0===i?f.tabbableGroups.length-1:i-1;a=f.tabbableGroups[c].lastTabbableNode}}else{var s=u(f.tabbableGroups,(function(e){var t=e.lastTabbableNode;return n===t}));if(s<0&&(r.container===n||t.isFocusable(n,b.tabbableOptions)&&!t.isTabbable(n,b.tabbableOptions)&&!r.nextTabbableNode(n))&&(s=o),s>=0){var v=s===f.tabbableGroups.length-1?0:s+1;a=f.tabbableGroups[v].firstTabbableNode}}}else a=p("fallbackFocus");a&&(e.preventDefault(),m(a))}(e)},w=function(e){var t=l(e);d(t)>=0||s(b.clickOutsideDeactivates,e)||s(b.allowOutsideClick,e)||(e.preventDefault(),e.stopImmediatePropagation())},E=function(){if(f.active)return i.activateTrap(o),f.delayInitialFocusTimer=b.delayInitialFocus?c((function(){m(h())})):m(h()),r.addEventListener("focusin",T,!0),r.addEventListener("mousedown",g,{capture:!0,passive:!1}),r.addEventListener("touchstart",g,{capture:!0,passive:!1}),r.addEventListener("click",w,{capture:!0,passive:!1}),r.addEventListener("keydown",F,{capture:!0,passive:!1}),o},k=function(){if(f.active)return r.removeEventListener("focusin",T,!0),r.removeEventListener("mousedown",g,!0),r.removeEventListener("touchstart",g,!0),r.removeEventListener("click",w,!0),r.removeEventListener("keydown",F,!0),o};return(o={get active(){return f.active},get paused(){return f.paused},activate:function(e){if(f.active)return this;var t=v(e,"onActivate"),n=v(e,"onPostActivate"),a=v(e,"checkCanFocusTrap");a||y(),f.active=!0,f.paused=!1,f.nodeFocusedBeforeActivation=r.activeElement,t&&t();var o=function(){a&&y(),E(),n&&n()};return a?(a(f.containers.concat()).then(o,o),this):(o(),this)},deactivate:function(e){if(!f.active)return this;var t=a({onDeactivate:b.onDeactivate,onPostDeactivate:b.onPostDeactivate,checkCanReturnFocus:b.checkCanReturnFocus},e);clearTimeout(f.delayInitialFocusTimer),f.delayInitialFocusTimer=void 0,k(),f.active=!1,f.paused=!1,i.deactivateTrap(o);var n=v(t,"onDeactivate"),r=v(t,"onPostDeactivate"),u=v(t,"checkCanReturnFocus"),s=v(t,"returnFocus","returnFocusOnDeactivate");n&&n();var l=function(){c((function(){s&&m(O(f.nodeFocusedBeforeActivation)),r&&r()}))};return s&&u?(u(O(f.nodeFocusedBeforeActivation)).then(l,l),this):(l(),this)},pause:function(){return f.paused||!f.active||(f.paused=!0,k()),this},unpause:function(){return f.paused&&f.active?(f.paused=!1,y(),E(),this):this},updateContainerElements:function(e){var t=[].concat(e).filter(Boolean);return f.containers=t.map((function(e){return"string"==typeof e?r.querySelector(e):e})),f.active&&y(),this}}).updateContainerElements(e),o},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=focus-trap.umd.min.js.map

$.pdBox = (function () {

	/*************** configuration ***************/

	var defaults = {
		width: 900,
		className: '',
		imageThumbnails: false,
		imageThumbnailsAlign: {
			behavior: 'smooth',
			block: 'nearest',
			inline: 'center'
		},
		overlayPreventClose: false,
		infinitePager: false,
		lang: ($('html').attr('lang') || 'cs')
	};
	var langs = {
		cs: { close: "Zavřít",   prev: "Předchozí",      next: "Další",       of: "/" },
		sk: { close: "Zavrieť",  prev: "Predchádzajúca", next: "Ďalšie",      of: "/" },
		en: { close: "Close",    prev: "Previous",       next: "Next",        of: "/" },
		de: { close: "Zumachen", prev: "Vorige",         next: "Folgend",     of: "/" },
		es: { close: "Vaer",     prev: "Previo",         next: "Siguiente",   of: "/" },
		fr: { close: "Fermer",   prev: "Précédant",      next: "Suivant",     of: "/" },
		it: { close: "Chiudere", prev: "Previo",         next: "Veniente",    of: "/" },
		ro: { close: "Închide",  prev: "Anterior",       next: "Următor",     of: "/" },
		sr: { close: "Zatvori",  prev: "Prethodna",      next: "Sledeći",     of: "/" },
		ru: { close: "закрыть",  prev: "Предшествующий", next: "Последующий", of: "/" },
		bg: { close: "Затвори",  prev: "Предишен",       next: "Следващия",   of: "/" }
	};
	var events = ['beforeOpen', 'afterOpen', 'load', 'beforeClose', 'afterClose'];

	/*************** pdbox core ***************/

	function PdBox(options) {
		// defaults = nastavení shodné pro všechny TB dané instance aktualizováno z předaných options; šířku lze přepsat data atributem, class se sjednotí
		// options  = nastavení konkrétně otevřeného TB této instance

		options = options || {};

		// Překopírujeme všechny hodnoty s přepsáním z předaných options
		this.defaults = {};
		for (var i in defaults) {
			if (defaults.hasOwnProperty(i)) {
				this.defaults[i] = (typeof options[i] !== 'undefined') ? options[i] : defaults[i];
			}
		}
		// className se nepřepisuje, ale spojuje, zpracujeme zvlášť
		this.defaults.className = defaults.className + ((options.className) ? ' ' + options.className : '');


		this.options = $.extend({}, defaults, options);

		// nutno převést na string, jinak nelze uložit jako součást state v history API; případné další použití např. pomocí eval()
		if (options.template) {
			this.options.template = options.template.toString();
		}

		// vlastní jazyky
		if (typeof options.langs === 'object') {
			this.langs = $.extend({}, langs, options.langs);
		}
		else {
			this.langs = langs;
		}

		// nastavení default jazyka, pokud neexistuje jazyk TB stejný, jako jazyk stránky
		if (! (this.options.lang in this.langs)) {
			this.options.lang = 'en';
		}

		this.isOpen = false;
		this.setOnOpenOptions = false; // flag do fce setOptions, jestli byl otevřený před voláním této funkce, nebo se teprve otevírá
		this.isAjax = options.isAjax || false;
		this.isInner = options.isInner || false;
		this.events = {};

		this.overlay = null;
		this.rootElem = {};
		this.window = {};
		this.$doc = $(document);
		this.$body = $('body');
		this.spinnerHtml = options.spinnerHtml || "<span class='pdbox__spinner'></span>";
		this.html = (typeof options.template === 'function') ? options.template(this) : buildContent(this);

		this.trap = null;

		this.$el = null; // element, který otevřel pdbox

		var optName = '';
		for (i = 0; i < events.length; i++) {
			optName = getEventOptName(events[i]);

			if (typeof options[optName] === 'object') {
				for (fn in options[optName]) {
					if (options[optName].hasOwnProperty(fn) && typeof options[optName][fn] === 'function') {
						this.addEventListener(events[i], options[optName][fn]);
					}
				}
			}
			else if (typeof options[optName] === 'function') {
				this.addEventListener(events[i], options[optName]);
			}

			// vymazání hodnoty, ta slouží k uchování ad-hoc handlerů přes element
			this.options[optName] = undefined;
		}

		this.addEventListener('load', function () {
			this.rootElem.removeClass('pdbox--loading');
			this.trap = focusTrap.createFocusTrap('.pdbox', {
				escapeDeactivates: false,
				clickOutsideDeactivates: false
			});
			this.trap.activate();
		});


		this.addEventListener('afterOpen', checkScrollbars);
		this.addEventListener('load',      checkScrollbars);

		this.addEventListener('afterClose', function () {
			this.trap.deactivate();
		});

		createPdboxStylesheet();
	}

	function buildContent(box) {
		$content =
			"<div class='pdbox__window'>" +
			"	<div class='pdbox__content'>" +
			"		<h2 class='pdbox__title'></h2>" +
			"		<div class='pdbox__desc'>" +
			(box.isAjax ? "<div id='snippet--pdbox' class='pdbox__snippet'></div>" : "") +
			"		</div>" +
			"		<p class='pdbox__pager'>" +
			"			<a href='#' class='pdbox__page pdbox__page--prev' rel=''><span>" + box.langs[box.options.lang]["prev"] + "</span></a>" +
			"			<span class='pdbox__pages'></span>" +
			"			<span class='pdbox__pages-summary'><span class='pdbox__active-page'></span>" + box.langs[box.options.lang]["of"] + "<span class='pdbox__pages-count'></span></span>" +
			"			<a href='#' class='pdbox__page pdbox__page--next' rel=''><span>" + box.langs[box.options.lang]["next"] + "</span></a>" +
			"		</p>" +
			"		<p class='pdbox__media-box'></p>" +
			"		<div class='pdbox__pager--thumbnails'></div>" +
			box.spinnerHtml +
			"		<a href='#' class='pdbox__close' title='" + box.langs[box.options.lang]["close"] + "'> " + box.langs[box.options.lang]["close"] + "</a>" +
			"	</div>" +
			"</div>";

		return $content;
	}

	PdBox.prototype.open = function ($el, selector, loadedContent) {
		this.$el = $el;

		if ( ! this.isOpen) {
			this.isOpen = true;
			this.setOnOpenOptions = true;
			this.isBodyOverflowing = isBodyOverflowing();

			this.dispatchEvent('beforeOpen', {element: $el});

			showBox(this);
			showOverlay(this);

			if (! loadedContent) {
				this.rootElem.addClass('pdbox--loading');
			}

			if (this.isInner) {
				this.rootElem.addClass('pdbox--inner');
			}

			this.setOptions();
			this.setOnOpenOptions = false;
		}
		else {
			this.removeEventListener('load', this.setOptions);
		}

		this.addEventListener('load', this.setOptions);

		this.window.elem.on('click', $.proxy(windowElemClickHandler, this));

		this.$body.addClass('pdbox-open');

		this.window.pager.elem.hide();
		this.window.pager.thumbnails.hide();
		this.window.media.hide();
		this.window.title.hide();

		if (typeof $el !== 'undefined' && typeof selector !== 'undefined' && $el.is(':not(.ajax)')) {
			groupBox(this, $el, selector);
		}

		this.dispatchEvent('afterOpen', {element: $el});
	};

	PdBox.prototype.close = function (event) {
		if (this.isOpen) {
			var $el = this.$el;

			this.isOpen = false;
			this.$el = null;

			this.removeEventListener('load', this.setOptions);

			this.rootElem.addClass('pdbox--closing');
			this.dispatchEvent('beforeClose', {element: $el, event: event});

			this.window.elem.off();

			var closingDuration = parseInt(getComputedStyle(this.rootElem[0]).getPropertyValue('--pdbox-closing-duration') || 0);

			var that = this;
			setTimeout(function() {
				hideBox(that);

				if ( ! that.isInner) {
					that.$body.removeClass('pdbox-open pdbox-open--scrollbar-offset');
				}

				that.dispatchEvent('afterClose', {element: $el, event: event});
			}, closingDuration);
		}
	};

	PdBox.prototype.content = function (html) {
		if (typeof html === 'undefined') {
			var $content = this.window.elem.clone();
			$content.find('.ajax-overlay, .ajax-loader').remove();
			return $content.html();

		} else {
			this.window.elem.html(html);
			this.window.content = this.window.elem.find('.pdbox__content');
		}
	};

	/**
	 * Nastaví vlastnosti pdboxu v pořadí defaults, nastavení z inicializace, nastavení z data atributů elementu,
	 * který tb otevřel. Pokud je předán atribut options, použije se nsatavení z tohoto atributu.
	 *
	 * @param options		předané options
	 * @param isOptions		flag, zda jde opravdu o options a ne kontext předaný z onLoad callbacku
	 */
	PdBox.prototype.setOptions = function (options, isOptions) {
		var i;
		var optName;
		var dataName;

		// pokud TB otevíráme, chceme defaults, jinak ne
		if (this.setOnOpenOptions) {
			// v tuto chvíli pouze šířka a class
			$.extend(this.options, this.defaults);

			// slouží k ad-hoc handlerům, proto můžeme smazat
			for (i = 0; i < events.length; i++) {
				optName = getEventOptName(events[i]);

				this.options[optName] = null;
			}
		}

		// pokud je el, získej z něj vlastnosti
		if (this.$el) {
			var elOptions = {};

			elOptions.width = this.$el.data('pdboxWidth');
			elOptions.className = this.$el.data('pdboxClassName') ? this.$el.data('pdboxClassName') + ' ' + this.defaults.className : this.defaults.className;
			elOptions.overlayPreventClose = this.$el.data('pdboxOverlayPreventClose') ? this.$el.data('pdboxOverlayPreventClose') : this.defaults.overlayPreventClose;

			for (i = 0; i < events.length; i++) {
				dataName = getEventDataName(events[i]);
				optName = getEventOptName(events[i]);

				elOptions[optName] = this.$el.data(dataName);
			}

			$.extend(this.options, elOptions);
		}

		// pokud byly předány options, ověříme, že jde skutečně o options a ne o context předaný v rámci onLoad callbacku
		if (options && isOptions) {
			$.extend(this.options, options);
		}

		this.rootElem
			// odstraníme všechny class krom povolených interních modifikátorů
			.removeClass(function(i, className) {
				var list = className.split(' ');
				var allowedClass = ['pdbox', 'pdbox--loading', 'pdbox--media', 'pdbox--inner'];

				return list.filter(function(val){
					return allowedClass.indexOf(val) === -1;
				}).join(' ');
			})
			.addClass(this.options.className);

		this.window.content.css({
			'max-width': this.options.width + 'px'
		});
	};

	/*************** events ***************/

	var registerEvent = function (type) {
		if ( ! (type in this.events)) {
			this.events[type] = [];
		}
	};

	PdBox.prototype.addEventListener = function (type, listener) {
		registerEvent.call(this, type);
		this.events[type].push(listener);
	};

	PdBox.prototype.removeEventListener = function (type, listener) {
		registerEvent.call(this, type);
		if (typeof type === 'undefined') {
			this.events = {};

		} else {
			this.events[type] = $.grep(this.events[type], function (callback) {
				return typeof listener !== 'undefined' ? callback !== listener : false;
			});
		}
	};

	PdBox.prototype.dispatchEvent = function (type, data) {
		registerEvent.call(this, type);
		for (var i = 0; i < this.events[type].length; i++) {
			this.events[type][i].call(this, data);
		}

		// support for ad-hoc listeners
		var name = getEventOptName(type);
		if (this.options[name]) {
			var funcArray = this.options[name].split(' ');

			for(i = 0; i < funcArray.length; i++) {
				var func = getFunction(funcArray[i].trim(), window);
				if (func !== null) func.call(this, data);
			}
		}
	};

	var getFunction = function (name, scope) {
		var pieces = name.split('.');
		var current = scope;

		for (var i = 0; i < pieces.length; i++) {
			if (pieces[i] in current) {
				current = current[pieces[i]];
			} else {
				return null;
			}
		}

		return current;
	};


	var getEventDataName = function (event) {
		return 'pdboxOn' + event.charAt(0).toUpperCase() + event.slice(1);
	};


	var getEventOptName = function (event) {
		return 'on' + event.charAt(0).toUpperCase() + event.slice(1);
	};

	/*************** shortcuts ***************/

	PdBox.prototype.openHtml = function (html, $el) {
		var title = $el.data('pdbox-title');

		this.open($el, undefined, true);

		this.window.descWrap.show();
		this.window.desc.html(html);
		if (title) {
			this.window.title.show().text(title);
		} else {
			this.window.title.hide();
		}

		this.dispatchEvent('load', {element: $el, content: html});
	};

	PdBox.prototype.openUrl = function (href, $el) {
		this.open($el, undefined, false);

		$.ajax({
			url: href,
			success: $.proxy(function (content) {
				this.window.descWrap.show();
				this.window.desc.html(content);
				this.dispatchEvent('load', {element: $el, content: content});
			}, this)
		});
	};


	/*************** box ***************/

	function showBox(box) {
		box.rootElem = $('<div class="pdbox u-out"></div>');
		box.rootElem
			.html(box.html)
			.prependTo(box.$body);

		box.window.elem = box.rootElem.find('.pdbox__window');

		box.window.close = box.window.elem.find('.pdbox__close');
		box.window.title = box.window.elem.find('.pdbox__title');
		box.window.content = box.window.elem.find('.pdbox__content');
		box.window.descWrap = box.window.elem.find('.pdbox__desc');
		box.window.desc = box.window.elem.find('.pdbox__snippet');
		if (! box.window.desc.length) box.window.desc = box.window.descWrap;

		box.window.pager = {
			elem: box.window.elem.find('.pdbox__pager'),
			pages: box.window.elem.find('.pdbox__pages'),
			pagesSummary: box.window.elem.find('.pdbox__pages-summary'),
			activePage: box.window.elem.find('.pdbox__active-page'),
			pagesCount: box.window.elem.find('.pdbox__pages-count'),
			prev: box.window.elem.find('.pdbox__page--prev'),
			next: box.window.elem.find('.pdbox__page--next'),
			thumbnails: box.window.elem.find('.pdbox__pager--thumbnails')
		};

		box.window.media = box.window.elem.find('.pdbox__media-box');

		$(document).on('click.pdbox', '.pdbox__close, .pdbox__close--alternative', $.proxy(windowElemClickHandler, box));
		box.$doc.on('keyup.pdbox', $.proxy(escapeKeyHandler, box));
	}

	function hideBox(box) {
		box.window.close.off();
		box.window.pager.next.off();
		box.window.pager.prev.off();
		box.window.pager.pages.find('a').off();
		box.window.pager.thumbnails.off();

		box.overlay.off();

		box.$doc.off('keyup.pdbox');

		box.rootElem.remove();
	}

	function groupBox(box, $el, selector) {
		var rel = $el.data('rel');
		if (rel) {
			var $all = $(selector);
			var $thumbnails = $([]);

			var $group = $all.filter('[data-rel="' + rel + '"]');

			var htmlPages = '';
			$group.each(function (i) {
				htmlPages += " <a href='" + this.href + "' class='pdbox__page'>" + (i + 1) + "</a> ";
			});
			box.window.pager.pages.empty().append(htmlPages);

			if (box.options.imageThumbnails) {
				var thumbnails = '';
				$group.each(function (i) {
					var $el = $(this);
					var alt = $el.data('pdbox-title') || $el.find('img').attr('alt') || $el.attr('title') || '';
					thumbnails += "<li class='pdbox__thumbnail-item'><a href='" + this.href + "' class='pdbox__thumbnail-link'><img class='pdbox__thumbnail' src='" + $el.data('pdbox-thumbnail') + "' alt='" + alt + "'></a></li>";
				});

				box.window.pager.thumbnails
					.append($('<ul class="pdbox__thumbnail-list"/>'))
					.find('.pdbox__thumbnail-list')
					.append(thumbnails);
				box.window.pager.thumbnails.show();


				$thumbnails = box.window.pager.thumbnails.find('a');
			}
			else {
				box.window.pager.thumbnails.hide();
			}


			$numbers = box.window.pager.pages.find('a');
			$numbers
				.on('click.pdbox open.pdbox', function (e) {
					var $this = $(this);
					var index = $numbers.index(this);

					$numbers.removeClass('pdbox__page--active');
					$this.addClass('pdbox__page--active');

					if ($thumbnails.length) {
						$thumbnails.removeClass('pdbox__thumbnail-link--active');
						$thumbnails
							.eq(index)
							.addClass('pdbox__thumbnail-link--active');


						var imageThumbnailsAlign = box.options.imageThumbnailsAlign;
						if (typeof box.options.imageThumbnailsAlign === 'function') {
							imageThumbnailsAlign = box.options.imageThumbnailsAlign();
						}

						if (e.type === 'open' && typeof imageThumbnailsAlign === 'object' && imageThumbnailsAlign.behavior === 'smooth') {
							imageThumbnailsAlign = $.extend({}, box.options.imageThumbnailsAlign);
							imageThumbnailsAlign.behavior = 'auto';
						}

						$thumbnails[index].scrollIntoView(imageThumbnailsAlign);
					}

					box.window.pager.activePage.text(index + 1);

					if (! box.options.infinitePager) {
						if (index === 0) {
							box.window.pager.prev.addClass('pdbox__page--disabled');
						} else {
							box.window.pager.prev.removeClass('pdbox__page--disabled');
						}

						if (index === $numbers.length - 1) {
							box.window.pager.next.addClass('pdbox__page--disabled');
						} else {
							box.window.pager.next.removeClass('pdbox__page--disabled');
						}
					}

					loadMedia(box, this.href, $group.eq(index));

					e.preventDefault();
				})
				.eq($group.index($el)).trigger('open.pdbox');

			if ($thumbnails.length) {
				$thumbnails.on('click.pdbox', function (e) {
					e.preventDefault();

					$numbers.eq($thumbnails.index(this)).trigger('click.pdbox');
				})
			}

			box.window.pager.prev.on('click.pdbox', function (e) {
				e.preventDefault();

				var $prevPage = box.window.pager.pages.find('.pdbox__page--active').prev();

				if ($prevPage.length === 0 && box.options.infinitePager) {
					$prevPage = box.window.pager.pages.find('.pdbox__page').last();
				}

				if ($prevPage.length) {
					$prevPage.trigger('click.pdbox');
				}
			});
			box.window.pager.next.on('click.pdbox', function (e) {
				e.preventDefault();

				var $nextPage = box.window.pager.pages.find('.pdbox__page--active').next();

				if ($nextPage.length === 0 && box.options.infinitePager) {
					$nextPage = box.window.pager.pages.find('.pdbox__page').first();
				}

				if ($nextPage.length) {
					$nextPage.trigger('click.pdbox');
				}
			});
			box.$doc.on('keyup.pdbox', $.proxy(pageKeyHandler, box));

			if ($numbers.length > 1) {
				box.window.pager.elem.show();
				box.window.pager.pagesCount.text($numbers.length);
			}
		}
	}

	function loadMedia(box, href, $el) {
		var $img = $el.find('img');
		var title = $el.data('pdbox-title') || $img.attr('alt') || $el.attr('title');
		var description = $el.data('pdbox-description') || $img.attr('title') || '';
		var srcset = $el.data('pdbox-srcset');

		box.rootElem.addClass('pdbox--loading pdbox--media');

		box.window.media.show();

		if (title) {
			box.window.title.show().text(title);
		} else {
			box.window.title.hide();
		}

		if (description) {
			box.window.descWrap.show();
			box.window.desc.html('<p>' + description + '</p>');
		} else {
			box.window.descWrap.hide();
		}


		var isVideo = $el.data('pdbox-video');
		var mediaClass = 'pdbox__media ' + (isVideo ? 'pdbox__media--video' : 'pdbox__media--image');
		var attrs = {
			src: href
		};

		preloader = document.createElement(isVideo ? 'iframe' : 'img');

		$(preloader).on('load insert', function (e) {
			// video vkládáme na onload událost, iframe musíme vložit manuálně při jiné události (onload nenastane pro iframe, které nejsou v DOM)
			if ((! isVideo && e.type === 'load') || (isVideo && e.type === 'insert')) {
				box.window.media.html(this);
			}

			if (e.type === 'load') {
				box.dispatchEvent('load', {element: $el, content: preloader});
			}
		});

		if (! isVideo && title) {
			attrs.alt = title
		}

		if (isVideo) {
			attrs.allowfullscreen = true;
			attrs.width = box.options.width;
			attrs.height = box.options.width / (16 / 9);
		} else if (srcset) {
			attrs.srcset = srcset;

			// sizes mají význam pouze v kombinaci se srcset
			var sizes = $el.data('pdbox-sizes');
			if (sizes || (sizes = box.options.sizes)) {
				attrs.sizes = sizes;
			}
		}

		$(preloader)
			.addClass(mediaClass)
			.attr(attrs);

		if (isVideo) {
			$(preloader).triggerHandler('insert');
		}
	}

	function escapeKeyHandler(e) {
		if (e.which === 27) {
			this.close(e);
		}
	}

	function pageKeyHandler(e) {
		if (e.which === 37) {
			this.window.pager.prev.not('.pdbox__page--disabled').trigger('click');

		} else if (e.which === 39) {
			this.window.pager.next.not('.pdbox__page--disabled').trigger('click');
		}

		e.preventDefault();
	}


	/************** scrollbar **************/

	function checkScrollbars() {
		if (this.isBodyOverflowing) {
			this.$body.addClass('pdbox-open--scrollbar-offset');
		}
		else {
			if (isPdboxOverflowing(this)) {
				this.window.elem.addClass('pdbox__window--scrollbar-offset');
			}
			else {
				this.window.elem.removeClass('pdbox__window--scrollbar-offset');
			}
		}
	}

	function isBodyOverflowing() {
		var rect = document.body.getBoundingClientRect();

		return rect.left + rect.right < window.innerWidth;
	}

	function isPdboxOverflowing(box) {
		return box.window.elem && box.window.elem[0].scrollHeight > document.documentElement.clientHeight;
	}

	function createPdboxStylesheet() {
		var styleEl = document.createElement('style');
		document.head.appendChild(styleEl);

		var styleSheet = styleEl.sheet;
		styleSheet.insertRule(':root { --pdbox-scrollbar-width:' + getScrollbarWidth() + 'px; }', styleSheet.cssRules.length);
	}

	function getScrollbarWidth() {
		var inner = document.createElement('p');
		inner.style.width = "100%";
		inner.style.height = "200px";

		var outer = document.createElement('div');
		outer.style.position = "absolute";
		outer.style.top = "0px";
		outer.style.left = "0px";
		outer.style.visibility = "hidden";
		outer.style.width = "200px";
		outer.style.height = "150px";
		outer.style.overflow = "hidden";
		outer.appendChild (inner);

		document.body.appendChild(outer);
		var w1 = inner.offsetWidth;
		outer.style.overflow = 'scroll';
		var w2 = inner.offsetWidth;
		if (w1 === w2) w2 = outer.clientWidth;

		document.body.removeChild(outer);

		return (w1 - w2);
	}


	/*************** overlay ***************/

	function showOverlay(box) {
		box.overlay = $('<div class="pdbox__overlay"></div>').prependTo(box.rootElem);
	}

	function windowElemClickHandler(e) {
		var $el = $(e.target).closest('a');

		if(
			(!this.options.overlayPreventClose && e.target === this.window.elem[0])
			|| (this.window.elem.has(e.target).length && ($el.hasClass('pdbox__close') || $el.hasClass('pdbox__close--alternative')))
		) {
			this.close(e);
			e.preventDefault();
		}
	}


	return PdBox;

})();
