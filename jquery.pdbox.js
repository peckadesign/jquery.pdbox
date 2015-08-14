$.pdBox = (function () {

	/*************** configuration ***************/

	var defaults = {
		width: 900,
		className: '',
		lang: ($('html').attr('lang') || 'cs')
	};
	var langs = {
		cs: { close: "Zavřít", prev: "předchozí", next: "další" },
		en: { close: "Close", prev: "previous", next: "next" },
		de: { close: "Zumachen", prev: "vorige", next: "folgend" },
		es: { close: "Vaer", prev: "previo", next: "siguiente" },
		fr: { close: "Fermer", prev: "précédant", next: "suivant" },
		it: { close: "Chiudere", prev: "previo", next: "veniente" },
		sk: { close: "Zavrieť", prev: "predchádzajúca", next: "ďalšie" },
		ru: { close: "закрыть", prev: "предшествующий", next: "последующий" }
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

		this.isOpen = false;
		this.isAjax = options.isAjax || false;
		this.isInner = options.isInner || false;
		this.events = {};

		this.overlay = null;
		this.window = {};
		this.$doc = $(document);
		this.$body = $('body');
		this.$html = $('html');
		this.html = buildContent(this);

		this.addEventListener('load', function () {
			this.window.elem.removeClass('loading');
		});

	}

	function buildContent(box) {
		$content =
			"<div class='pd-box-content'>"
				+ "<h2 class='pd-box-title'></h2>"
				+ "<div class='pd-box-desc'>"
					+ (box.isAjax ? "<div id='snippet--pdbox'></div>" : "")
				+ "</div>"
				+ "<p class='pd-box-pager'>"
					+ "<a href='#' class='pd-box-prev' rel=''><span>" + langs[box.options.lang]["prev"] + "</span></a>"
					+ "<span class='pd-box-pages'></span>"
					+ "<a href='#' class='pd-box-next' rel=''><span>" + langs[box.options.lang]["next"] + "</span></a>"
				+ "</p>"
				+ "<a href='#' class='pd-box-image' title='" + langs[box.options.lang]["close"] + "'></a>"
				+ "<span href='#' class='pd-box-loader'><span class='pd-box-loader-in'></span></span>"
				+ "<a href='#' class='pd-box-close' title='" + langs[box.options.lang]["close"] + "'> " + langs[box.options.lang]["close"] + "<span></span></a>"
			+ "</div>";

		return $content;
	}

	PdBox.prototype.open = function ($el, selector) {
		if ( ! this.isOpen) {
			this.isOpen = true;
			this.dispatchEvent('open', {element: $el});
			showBox(this);
			showOverlay(this);

			this.window.elem.addClass('loading');

			if (this.isInner) {
				this.window.elem.addClass('pd-box-window-inner');
				this.overlay.addClass('pd-box-overlay-inner');
			}

		}

		this.setOptions($el);

		this.addEventListener('load', function () {
			this.setOptions($el);
		});

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
		}
	};

	PdBox.prototype.setOptions = function ($el) {
		if ($el) {
			this.options.width = $el.data('thickboxWidth') || this.defaults.width;
			this.options.className = $el.data('thickboxClassName') ? $el.data('thickboxClassName') + ' ' + this.defaults.className : this.defaults.className;
			this.options.onOpen = $el.data('thickboxOnOpen') || null;
			this.options.onLoad = $el.data('thickboxOnLoad') || null;
			this.options.onClose = $el.data('thickboxOnClose') || null;
		}
		else {
			this.options.width = this.defaults.width;
			this.options.className = this.defaults.className;
			this.options.onOpen = null;
			this.options.onLoad = null;
			this.options.onClose = null;
		}

		this.window.content
			.removeClass()
			.addClass('pd-box-content')
			.addClass(this.options.className);

		this.window.content.css({
			'max-width': this.options.width + 'px'
		});
	}

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

		this.window.desc.show().html(html);
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
				this.window.desc.show().html(content);
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
		box.window.desc = box.window.elem.find('.pd-box-desc');
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

				if (index == 0) {
					box.window.prev.addClass('hide');
				} else {
					box.window.prev.removeClass('hide');
				}

				if (index == numbers.size() - 1) {
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

			if (numbers.size() > 1) {
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
			box.window.desc.show().html('<p>' + description + '</p>');
		} else {
			box.window.desc.hide();
		}

		preloader = document.createElement('img');
		$(preloader).on('load', function () {
			var imgWidth = this.width;

			box.window.image
				.empty()
				.css({
					maxWidth: '',
					maxHeight: '',
					overflow: ''
				})
				.append(this)
				.show();

			box.dispatchEvent('load', {content: preloader});
		});
		$(preloader).attr('src', href);
	}

	function escapeKeyHandler(e) {
		if (e.which == 27) {
			this.close();
		}
	}

	function pageKeyHandler(e) {
		if (e.which == 37) {
			this.window.prev.filter(':visible').trigger('click');

		} else if (e.which == 39) {
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
		if(e.target == this.window.elem[0] || (this.window.elem.has(e.target).length && ($el.hasClass('pd-box-close') || $el.hasClass('pd-box-close-alter')))) {
			this.close();
			e.preventDefault();
		}
	}


	return PdBox;

})();