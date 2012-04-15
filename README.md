# Dock.js

Dock.js is a lightweight jQuery plugin for multiple headers to be docked on the top of the page.
See the demo at http://yl335.github.com/Dock/

1. How to use
2. Options
3. Other things to note

## How to use

1. Download dock.js
2. Include the script right after jquery
    <script type="text/javascript" src="dock.js"></script>
3. Call .dock() on all elements you want to be docked when scrolling up
    $('#header, #nav').dock();

## Options

Beside dock selected DOM elements, dock.js can also be used to observe content elements and invoke callback functions when a content element is directly under the docked.

	$("nav").dock();
	$("nav").dock('addObserver', {
		'selector'		: 'section',
		'setup'			: function ($section) {
			var sectionID = $section.attr("id");
			$("nav .active").removeClass("active");
			$("nav ."+sectionID).addClass("active");
		}
	});

## Other notes

Dock.js is extended from Marc Robichaud's plugin. If you have any feedback or would like to contribute, please contact me.
