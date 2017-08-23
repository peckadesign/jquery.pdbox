$.pdBox = (function () {

	/*************** configuration ***************/

	var defaults = {
		width: 900,
		className: '',
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
		ru: { close: "закрыть",  prev: "Предшествующий", next: "Последующий", of: "/" }
	};
	var events = ['beforeOpen', 'afterOpen', 'load', 'beforeClose', 'afterClose'];

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
		this.rootElem = {};
		this.window = {};
		this.$doc = $(document);
		this.$body = $('body');
		this.$html = $('html');
		this.spinnerHtml = options.spinnerHtml || "<span class='pdbox__spinner'></span>";
		this.html = (typeof options.template === 'function') ? options.template(this) : buildContent(this);

		this.$el = null; // element, který otevřel pdbox

		var optName = '';
		for (var e in events) {
			optName = getEventOptName(events[e]);

			if (typeof options[optName] === 'object') {
				for (fn in options[optName]) {
					if (options[optName].hasOwnProperty(fn) && typeof options[optName][fn] === 'function') {
						this.addEventListener(events[e], options[optName][fn]);
					}
				}
			}
			else if (typeof options[optName] === 'function') {
				this.addEventListener(events[e], options[optName]);
			}

			// vymazání hodnoty, ta slouží k uchování ad-hoc handlerů přes element
			this.options[optName] = undefined;
		}

		this.addEventListener('load', function () {
			this.rootElem.removeClass('pdbox--loading');
		});

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
			"		<p class='pdbox__image'></p>" +
			"		<div class='pdbox__pager--thumbnails'></div>" +
					box.spinnerHtml +
			"		<a href='#' class='pdbox__close' title='" + box.langs[box.options.lang]["close"] + "'> " + box.langs[box.options.lang]["close"] + "</a>" +
			"	</div>" +
			"</div>";

		return $content;
	}

	PdBox.prototype.open = function ($el, selector) {
		this.$el = $el;

		if ( ! this.isOpen) {
			this.isOpen = true;
			this.setOnOpenOptions = true;
			this.dispatchEvent('beforeOpen', {element: $el});
			showBox(this);
			showOverlay(this);

			this.rootElem.addClass('pdbox--loading');

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
		this.window.image.hide();
		this.window.title.hide();

		if (typeof $el !== 'undefined' && typeof selector !== 'undefined' && $el.is(':not(.ajax)')) {
			groupBox(this, $el, selector);
		}

		this.dispatchEvent('afterOpen', {element: $el});
	};

	PdBox.prototype.close = function () {
		if (this.isOpen) {
			this.isOpen = false;
			this.$el = null;

			this.removeEventListener('load', this.setOptions);

			this.dispatchEvent('beforeClose');

			this.options.onOpen = this.options.onLoad = this.options.onClose = null;

			this.window.elem.off();

			hideBox(this);

			if ( ! this.isInner) {
				this.$body.removeClass('pdbox-open');
			}

			this.dispatchEvent('afterClose');
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
	 * @param options
	 */
	PdBox.prototype.setOptions = function (options) {
		var e;
		var optName;
		var dataName;

		// pokud TB otevíráme, chceme defaults, jinak ne
		if (this.setOnOpenOptions) {
			// v tuto chvíli pouze šířka a class
			$.extend(this.options, this.defaults);

			// slouží k ad-hoc handlerům, proto můžeme smazat
			for (e in events) {
				 optName = getEventOptName(events[e]);

				this.options[optName] = null;
			}
		}

		// pokud je el, získej z něj vlastnosti
		if (this.$el) {
			var elOptions = {};

			elOptions.width = this.$el.data('pdboxWidth');
			elOptions.className = this.$el.data('pdboxClassName') ? this.$el.data('pdboxClassName') + ' ' + this.defaults.className : this.defaults.className;

			for (e in events) {
				dataName = getEventDataName(events[e]);
				optName = getEventOptName(events[e]);

				elOptions[optName] = this.$el.data(dataName);
			}

			$.extend(this.options, elOptions);
		}

		if (options) {
			$.extend(this.options, options);
		}

		this.rootElem
			// odstraníme všechny class krom "pdbox" a případné "pdbox--loading"
			.removeClass(function(i, className) {
				var list = className.split(' ');
				return list.filter(function(val){
					return (val !== 'pdbox' && val !== 'pdbox--loading');
				}).join(' ');
			})
			.addClass('pdbox')
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


	var getEventDataName = function (event) {
		return 'pdboxOn' + event.charAt(0).toUpperCase() + event.slice(1);
	};


	var getEventOptName = function (event) {
		return 'on' + event.charAt(0).toUpperCase() + event.slice(1);
	};

	/*************** shortcuts ***************/

	PdBox.prototype.openHtml = function (html, $el) {
		var title = $el.data('pdbox-title');

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

		box.window.image = box.window.elem.find('.pdbox__image');

		$(document).on('click.pdbox', '.pdbox__close, .pdbox__close--alternative', $.proxy(windowElemClickHandler, box));
		box.$doc.on('keyup.pdbox', $.proxy(escapeKeyHandler, box));
		box.window.image.on('click.pdbox', $.proxy(function (e) {
			this.close();
			e.preventDefault();
		}, box));

	}

	function hideBox(box) {
		box.window.close.off();
		box.window.pager.next.off();
		box.window.pager.prev.off();
		box.window.pager.pages.find('a').off();
		box.window.pager.thumbnails.off();

		box.window.image.off();

		box.overlay.off();

		box.$doc.off('keyup.pdbox');

		box.rootElem.remove();
	}

	function groupBox(box, $el, selector) {
		var rel = $el.data('rel');
		if (rel) {
			var $all = $(selector);
			var $thumbnails = $([]);

			var group = $all.filter('[data-rel="' + rel + '"]');

			var htmlPages = '';
			group.each(function (i) {
				htmlPages += " <a href='" + this.href + "' class='pdbox__page'>" + (i + 1) + "</a> ";
			});
			box.window.pager.pages.empty().append(htmlPages);

			if (box.options.imageThumbnails) {
				var thumbnails = '';
				group.each(function (i) {
					thumbnails += "<li class='pdbox__thumbnail-item'><a href='" + this.href + "' class='pdbox__thumbnail-link'><img class='pdbox__thumbnail' src='" + $(this).data('pdbox-thumbnail') + "'></a>";
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
				.on('click.pdbox', function (e) {
					var $this = $(this);
					var index = $numbers.index(this);

					$numbers.removeClass('pdbox__page--active');
					$this.addClass('pdbox__page--active');

					box.window.pager.activePage.text(index + 1);

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

					loadImage(box, this.href, group.eq(index));

					e.preventDefault();
				})
				.eq(group.index($el)).trigger('click.pdbox');

			if ($thumbnails.length) {
				$thumbnails.on('click.pdbox', function (e) {
					e.preventDefault();

					$thumbnails.removeClass('pdbox__thumbnail-link--active');
					$(this).addClass('pdbox__thumbnail-link--active');

					$numbers.eq($thumbnails.index(this)).trigger('click.pdbox');
				})
			}

			box.window.pager.prev.on('click.pdbox', function (e) {
				e.preventDefault();
				box.window.pager.pages.find('.pdbox__page--active').prev().trigger('click.pdbox');
			});
			box.window.pager.next.on('click.pdbox', function (e) {
				e.preventDefault();
				box.window.pager.pages.find('.pdbox__page--active').next().trigger('click.pdbox');
			});
			box.$doc.on('keyup.pdbox', $.proxy(pageKeyHandler, box));

			if ($numbers.length > 1) {
				box.window.pager.elem.show();
				box.window.pager.pagesCount.text($numbers.length);
			}
		}
	}

	function loadImage(box, href, $el) {
		var $img = $('img', $el);
		var title = $img.attr('alt') || $el.attr('title');
		var description = $img.attr('title') || '';

		box.rootElem.addClass('pdbox--loading');

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


		var video = $el.data('pdbox-video');

		preloader = document.createElement(video ? 'iframe' : 'img');

		$(preloader).on('load insert', function (e) {
			// video vkládáme na onload událost, iframe musíme vložit manuálně při jiné události (onload nenastane pro iframe, které nejsou v DOM)
			if ((! video && e.type === 'load') || (video && e.type === 'insert')) {
				box.window.image
					[video ? 'addClass' : 'removeClass']('pdbox__video')
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
			this.window.pager.prev.not('.pdbox__page--disabled').trigger('click');

		} else if (e.which === 39) {
			this.window.pager.next.not('.pdbox__page--disabled').trigger('click');
		}

		e.preventDefault();
	}

	/*************** overlay ***************/

	function showOverlay(box) {
		box.overlay = $('<div class="pdbox__overlay"></div>').prependTo(box.rootElem);
	}

	function windowElemClickHandler(e) {
		var $el = $(e.target).closest('a');
		if(e.target === this.window.elem[0] || (this.window.elem.has(e.target).length && ($el.hasClass('pdbox__close') || $el.hasClass('pdbox__close--alternative')))) {
			this.close();
			e.preventDefault();
		}
	}


	return PdBox;

})();
