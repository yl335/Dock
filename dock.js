/* =========================================================
 * dock.js
 * https://github.com/yl335/Dock/blob/master/js/dock.js
 * =========================================================
 *
 * Author: @yl335, extended from Marc Robichaud's plugin
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {
	
/* PRIVATE VARIABLES
* ===================== */
	var dockingElements = [],
		windowHeight = 0,
		totalDockedHeight = 0,
		observers = [];
		
/* PUBLIC METHODS
* ===================== */
	var methods = {
		// contructor
		init: function(options) {
			return this.each(function(index, element) {
				var $el = $(element);
				// wrap the docking element for height placeholder
				$el.wrap('<div class="dock-wrapper" />').parent().css('height', $el.outerHeight());
				// add elements from options to dockingElements array
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
		// add observer to jQuery elements when they overlaps with the docked elements
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
					// add elements from options to observers array
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
		// return the current total docked height
		getTotalDockedHeight: function() {
			return totalDockedHeight;
		}
	};
	
/* PRIVATE METHODS
* ===================== */
	function updatePositions() {
		var scrollTop = $(window).scrollTop();
		$(dockingElements).each(function(index, element) {
			// set the docking element to fixed when it's about to be scrolled above the docked elements
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
			// change the docking element to position relative when it's to be scrolled below the docked elements
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
			// if the observed element is right below with the last docked element, invoke the setup function
			if (!observer.active && aboveDocked && belowDocked) {
				observer.$el.addClass("active");
				observer.active = true;
				if (observer.setup) {observer.setup(observer.$el); }
			}
			// if the observed element is going over the last docked element, invoke the destroy function
			else if (observer.active && (!aboveDocked | !belowDocked)) {
				observer.$el.removeClass("active");
				observer.active = false;
				if (observer.destroy) { observer.destroy(observer.$el); }
			}
		});
	}
	observeElements();
	
/* PLUGIN DEFINITION
* ===================== */
	$.fn.dock = function(method) {
		if (methods[method]) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || ! method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.dock' );
		}
	}
	
	// observe both scrolling and resizing, update the private methods
	$(document).scroll(updatePositions).scroll(observeElements);
	$(window).resize(updatePositions).resize(observeElements);
}(jQuery);