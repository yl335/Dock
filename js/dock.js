!function( $ ) {
	var dockingElements = [],
		windowHeight = 0,
		totalDockedHeight = 0,
		observers = [];
		
	var methods = {
		init: function(options) {
			return this.each(function(index, element) {
				var $el = $(element);
				$el.wrap('<div class="dock-wrapper" />').parent().css('height', $el.outerHeight());
				dockingElements.push({
					'$el': 			$el, 
					'height': 		$el.outerHeight(false), 
					'offsetY': 		$el.offset().top, 
					'docked': 		false, 
					'dockedHeight':	0,
					'$prev':		{}
				});
				updatePositions();
			});
		},
		addObserver: function(observer) {
			var obs = $.extend( {
				'selector'		: [],
				'setup'			: null,
				'destroy'		: null
			}, observer);
			var $el = $(obs.selector);
			if ($el) {
				return $el.each(function(index, element) {
					$element = $(element);
					observers.push({
						'$el'			: $element,
						'height'		: $element.outerHeight(false),
						'offsetY'		: $element.offset().top,
						'active'		: false,
						'setup'			: obs.setup,
						'destroy'		: obs.destroy
					});
				});
			}
			return 0;
		},
		getTotalDockedHeight: function() {
			return totalDockedHeight;
		}
	};
	
	function updatePositions() {
		var scrollTop = $(window).scrollTop();
		$(dockingElements).each(function(index, element) {
			if (!element.docked && (element.offsetY - scrollTop - totalDockedHeight) < 0) {
				element.$el.css({
					'position'		: 'fixed',
					'top'			: totalDockedHeight,
					'width'			: '100%',
					'z-index'		: 30
				});
				element.$prev = $(".docked.last");
				element.$prev.removeClass("last");
				element.$el.addClass("last");
				element.$el.addClass("docked");
				element.dockedHeight = totalDockedHeight;
				element.docked = true;
				totalDockedHeight += element.height;
			}
			else if (element.docked && (element.offsetY - scrollTop - element.dockedHeight >= 0)) {
				element.$el.css({
					'position'		: 'relative',
					'top'			: 0,
					'z-index'		: 0
				});
				element.$el.removeClass("last").removeClass("docked");
				element.$prev.addClass("last");
				element.dockedHeight = 0;
				element.docked = false;
				totalDockedHeight -= element.height;
			}
		});
	}
	updatePositions();

	function observeElements() {
		var scrollTop = $(window).scrollTop();
		$(observers).each(function(index, observer) {
			var aboveDocked = observer.offsetY - scrollTop - totalDockedHeight <= 0;
			var belowDocked = observer.offsetY + observer.height - scrollTop - totalDockedHeight > 0;
			if (!observer.active && aboveDocked && belowDocked) {
				observer.$el.addClass("active");
				observer.active = true;
				if (observer.setup) {observer.setup(observer.$el); }
			}
			else if (observer.active && (!aboveDocked | !belowDocked)) {
				observer.$el.removeClass("active");
				observer.active = false;
				if (observer.destroy) { observer.destroy(observer.$el); }
			}
		});
	}
	observeElements();
	
	$.fn.dock = function(method) {
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.dock' );
		}
	}
	
	$(document).scroll(updatePositions).scroll(observeElements);
	$(window).resize(updatePositions).resize(observeElements);
}(jQuery);