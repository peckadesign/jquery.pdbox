$.pdBox = (function () {

	/*************** configuration ***************/

	var defaults = {
		width: 900,
		className: '',
		lang: ($('html').attr('lang') || 'cs')
	};
	var langs = {
		cs: { close: "Zavřít",   prev: "Předchozí",      next: "Další" },
		sk: { close: "Zavrieť",  prev: "Predchádzajúca", next: "Ďalšie" },
		en: { close: "Close",    prev: "Previous",       next: "Next" },
		de: { close: "Zumachen", prev: "Vorige",         next: "Folgend" },
		es: { close: "Vaer",     prev: "Previo",         next: "Siguiente" },
		fr: { close: "Fermer",   prev: "Précédant",      next: "Suivant" },
		it: { close: "Chiudere", prev: "Previo",         next: "Veniente" },
		ru: { close: "закрыть",  prev: "Предшествующий", next: "Последующий" }
	};


	/*************** pdbox core ***************/

	function PdBox(options) {
		// defaults = nastavení shodné pro všechny TB dané instance aktualizováno z předaných options; šířku lze přepsat data atributem, class se sjednotí
		// options  = nastavení konkrétně otevřeného TB této instance

		options = options || {};

		this.defaults = {};
		this.defaults.width = defaults.width;
		this.defaults.className = defaults.className;

		if (options.width)     this.defaults.width = options.width;
		if (options.className) this.defaults.className += ' ' + options.className;

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
		this.window = {};
		this.$doc = $(document);
		this.$body = $('body');
		this.$html = $('html');
		this.spinnerHtml = options.spinnerHtml || "<span class='pd-box-loader'></span>";
		this.html = (typeof options.template === 'function') ? options.template(this) : buildContent(this);

		this.$el = null; // element, který otevřel pdbox

		this.addEventListener('load', function () {
			this.window.elem.removeClass('loading');
		});

	}

	function buildContent(box) {
		$content =
			"<div class='pd-box-content out'>"
			+ "<h2 class='pd-box-title'></h2>"
			+ "<div class='pd-box-desc'>"
			+ (box.isAjax ? "<div id='snippet--pdbox' class='pd-box-snippet'></div>" : "")
			+ "</div>"
			+ "<p class='pd-box-pager'>"
			+ "<a href='#' class='pd-box-prev' rel=''><span>" + box.langs[box.options.lang]["prev"] + "</span></a>"
			+ "<span class='pd-box-pages'></span>"
			+ "<a href='#' class='pd-box-next' rel=''><span>" + box.langs[box.options.lang]["next"] + "</span></a>"
			+ "</p>"
			+ "<p class='pd-box-image'></p>"
			+ box.spinnerHtml
			+ "<a href='#' class='pd-box-close' title='" + box.langs[box.options.lang]["close"] + "'> " + box.langs[box.options.lang]["close"] + "</a>"
			+ "</div>";

		return $content;
	}

	PdBox.prototype.open = function ($el, selector) {
		this.$el = $el;

		if ( ! this.isOpen) {
			this.isOpen = true;
			this.setOnOpenOptions = true;
			this.dispatchEvent('open', {element: $el});
			showBox(this);
			showOverlay(this);

			this.window.elem.addClass('loading');

			if (this.isInner) {
				this.window.elem.addClass('pd-box-window-inner');
				this.overlay.addClass('pd-box-overlay-inner');
			}

			this.setOptions();
			this.setOnOpenOptions = false;
		}
		else {
			this.removeEventListener('load', this.setOptions);
		}

		this.addEventListener('load', this.setOptions);

		this.window.elem.on('click', $.proxy(windowElemClickHandler, this));

		this.$body.addClass('pd-box-open');

		this.window.pager.hide();
		this.window.image.hide();
		this.window.title.hide();

		if (typeof $el != 'undefined' && typeof selector != 'undefined' && $el.is(':not(.ajax)')) {
			groupBox(this, $el, selector);
		}
	};

	PdBox.prototype.close = function () {
		if (this.isOpen) {
			this.isOpen = false;
			this.$el = null;

			this.removeEventListener('load', this.setOptions);

			this.dispatchEvent('close');
			this.removeEventListener('close');

			this.options.onOpen = this.options.onLoad = this.options.onClose = null;

			this.window.elem.off();

			hideBox(this);
			hideOverlay(this);

			if ( ! this.isInner) {
				this.$body.removeClass('pd-box-open');
			}

			this.dispatchEvent('afterClose');
			this.removeEventListener('afterClose');
		}
	};

	PdBox.prototype.content = function (html) {
		if (typeof html === 'undefined') {
			var $content = this.window.elem.clone();
			$content.find('.ajax-overlay, .ajax-loader').remove();
			return $content.html();

		} else {
			this.window.elem.html(html);
			this.window.content = this.window.elem.find('.pd-box-content');
		}
	};

	/**
	 * Nastaví vlastnosti thickboxu v pořadí defaults, nastavení z inicializace, nastavení z data atributů elementu,
	 * který tb otevřel. Pokud je předán atribut options, použije se nsatavení z tohoto atributu.
	 *
	 * @param options
	 */
	PdBox.prototype.setOptions = function (options) {
		// pokud TB otevíráme, chceme defaults, jinak ne
		if (this.setOnOpenOptions) {
			// v tuto chvíli pouze šířka a class
			$.extend(this.options, this.defaults);

			// callbacky nelze nastavovat při inicializaci, pouze přes data atributy, proto je můžeme smazat
			this.options.onOpen = null;
			this.options.onLoad = null;
			this.options.onClose = null;
		}

		// pokud je el, získej z něj vlastnosti
		if (this.$el) {
			var elOptions = {};

			elOptions.width = this.$el.data('thickboxWidth');
			elOptions.className = this.$el.data('thickboxClassName') ? this.$el.data('thickboxClassName') + ' ' + this.defaults.className : this.defaults.className;
			elOptions.onOpen = this.$el.data('thickboxOnOpen');
			elOptions.onLoad = this.$el.data('thickboxOnLoad');
			elOptions.onClose = this.$el.data('thickboxOnClose');

			$.extend(this.options, elOptions);
		}

		if (options) {
			$.extend(this.options, options);
		}

		this.window.content
			.removeClass()
			.addClass('pd-box-content')
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
		var name = 'on' + type.charAt(0).toUpperCase() + type.slice(1);
		if (this.options[name]) {
			var func = getFunction(this.options[name], window);
			if (func !== null) func(data);
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


	/*************** shortcuts ***************/

	PdBox.prototype.openHtml = function (html, $el) {
		var title = $el.data('thickbox-title');

		this.open($el);

		this.window.descWrap.show();
		this.window.desc.html(html);
		if (title) {
			this.window.title.show().text(title);
		} else {
			this.window.title.hide();
		}

		this.dispatchEvent('load', {content: html});
	};

	PdBox.prototype.openUrl = function (href) {
		this.open();
		$.ajax({
			url: href,
			success: $.proxy(function (content) {
				this.window.descWrap.show();
				this.window.desc.html(content);
				this.dispatchEvent('load', {content: content});
			}, this)
		});
	};


	/*************** box ***************/

	function showBox(box) {
		box.window.elem = $('<div class="pd-box-window"></div>');
		box.window.elem
			.html(box.html)
			.prependTo(box.$body);

		box.window.close = box.window.elem.find('.pd-box-close');
		box.window.title = box.window.elem.find('.pd-box-title');
		box.window.content = box.window.elem.find('.pd-box-content');
		box.window.descWrap = box.window.elem.find('.pd-box-desc');
		box.window.desc = box.window.elem.find('.pd-box-snippet');
		if (! box.window.desc.length) box.window.desc = box.window.descWrap;
		box.window.pager = box.window.elem.find('.pd-box-pager');
		box.window.pages = box.window.elem.find('.pd-box-pages');
		box.window.prev = box.window.elem.find('.pd-box-prev');
		box.window.next = box.window.elem.find('.pd-box-next');
		box.window.image = box.window.elem.find('.pd-box-image');

		$(document).on('click', '.pd-box-close, .pd-box-close-alter', $.proxy(windowElemClickHandler, box));
		box.$doc.on('keyup.pd', $.proxy(escapeKeyHandler, box));
		box.window.image.on('click', $.proxy(function (e) {
			this.close();
			e.preventDefault();
		}, box));

	}

	function hideBox(box) {
		box.window.close.off();
		box.window.next.off();
		box.window.prev.off();
		box.window.pages.find('a').off();

		box.$doc.off('keyup.pd');

		box.window.elem.remove();
	}

	function groupBox(box, $el, selector) {
		var $all = $(selector);
		var rel = $el.data('rel');
		if (rel) {
			var group = $all.filter('[data-rel="' + rel + '"]');

			var htmlPages = '';
			group.each(function (i) {
				htmlPages += " <a href='" + this.href + "'>" + (i + 1) + "</a> ";
			});
			box.window.pages.empty().append(htmlPages);

			numbers = $('a', box.window.pages);
			numbers.on('click', function (e) {
				var $this = $(this);
				var index = numbers.index(this);

				numbers.removeClass('active');
				$this.addClass('active');

				if (index === 0) {
					box.window.prev.addClass('hide');
				} else {
					box.window.prev.removeClass('hide');
				}

				if (index === numbers.length - 1) {
					box.window.next.addClass('hide');
				} else {
					box.window.next.removeClass('hide');
				}

				loadImage(box, this.href, group.eq(index));

				e.preventDefault();
			})
				.eq(group.index($el)).trigger('click');

			box.window.prev.on('click', function (e) {
				$('.active', box.window.pages).prev().trigger('click');
				e.preventDefault();
			});
			box.window.next.on('click', function (e) {
				$('.active', box.window.pages).next().trigger('click');
				e.preventDefault();
			});
			box.$doc.on('keyup.pd', $.proxy(pageKeyHandler, box));

			if (numbers.length > 1) {
				box.window.pager.show();
			}
		}
	}

	function loadImage(box, href, $el) {
		var $img = $('img', $el);
		var title = $img.attr('alt');
		var description = $img.attr('title') || '';

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


		var video = $el.data('thickbox-video');

		preloader = document.createElement(video ? 'iframe' : 'img');

		$(preloader).on('load insert', function (e) {
			// video vkládáme na onload událost, iframe musíme vložit manuálně při jiné události (onload nenastane pro iframe, které nejsou v DOM)
			if ((! video && e.type === 'load') || (video && e.type === 'insert')) {
				box.window.image
					[video ? 'addClass' : 'removeClass']('pd-box-video')
					.html(this)
					.show();
			}

			if (e.type === 'load') {
				box.dispatchEvent('load', {content: preloader});
			}
		});

		$(preloader).attr('src', href);

		if (video) {
			$(preloader)
				.attr({
					allowfullscreen: true,
					width: box.options.width,
					height: box.options.width / (16 / 9)
				})
				.triggerHandler('insert');
		}
	}

	function escapeKeyHandler(e) {
		if (e.which === 27) {
			this.close();
		}
	}

	function pageKeyHandler(e) {
		if (e.which === 37) {
			this.window.prev.filter(':visible').trigger('click');

		} else if (e.which === 39) {
			this.window.next.filter(':visible').trigger('click');
		}

		e.preventDefault();
	}

	/*************** overlay ***************/

	function showOverlay(box) {
		box.overlay = $('<div class="pd-box-overlay"></div>').prependTo(box.$body);
	}

	function hideOverlay(box) {
		box.overlay.off();
		box.overlay.remove();
	}

	function windowElemClickHandler(e) {
		var $el = $(e.target).closest('a');
		if(e.target === this.window.elem[0] || (this.window.elem.has(e.target).length && ($el.hasClass('pd-box-close') || $el.hasClass('pd-box-close-alter')))) {
			this.close();
			e.preventDefault();
		}
	}


	return PdBox;

})();
