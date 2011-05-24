/*
	jQuery Coda-Slider v2.0 - http://www.ndoherty.biz/coda-slider
	Copyright (c) 2009 Niall Doherty
	This plugin available for use in all personal or commercial projects under both MIT and GPL licenses.
	
	v2.1 - 'Carousel' sliding added by Joel Gillman - http://joelgillman.com/
*/

$(function(){
	// Remove the coda-slider-no-js class from the body
	$("body").removeClass("coda-slider-no-js");
	// Preloader
	$(".coda-slider").children('.panel').hide().end().prepend('<p class="loading">Loading...<br /><img src="images/ajax-loader.gif" alt="loading..." /></p>');
});

var sliderCount = 1;

$.fn.codaSlider = function(settings) {

	settings = $.extend({
		autoHeight: true,
		autoHeightEaseDuration: 1000,
		autoHeightEaseFunction: "easeInOutExpo",
		autoSlide: false,
		autoSlideInterval: 7000,
		autoSlideStopWhenClicked: true,
		carousel: false,
		crossLinking: true,
		dynamicArrows: true,
		dynamicArrowLeftText: "« left",
		dynamicArrowRightText: "right »",
		dynamicTabs: true,
		dynamicTabsAlign: "center",
		dynamicTabsPosition: "top",
		externalTriggerSelector: "a.xtrig",
		firstPanelToLoad: 1,
		panelTitleSelector: "h2.title",
		slideEaseDuration: 1000,
		slideEaseFunction: "easeInOutExpo"
	}, settings);
	
	return this.each(function(){
		
		// Uncomment the line below to test your preloader
		// alert("Testing preloader");
		
		var slider = $(this),
		panelWidth = slider.find(".panel").width(),
		panelCount = slider.find(".panel").size(),
		panelContainerWidth = (settings.carousel) ? panelWidth*(panelCount+1): panelWidth*panelCount,
		navClicks = 0, // Used if autoSlideStopWhenClicked = true
		last = false, // Used in carousel mode
		dynamicNavWidth = 0,
		currentPanel, offset, dynamicTabs;
		
		// If we need arrows
		if (settings.dynamicArrows) {
			slider.parent().addClass("arrows");
			slider.before('<div class="coda-nav-left" id="coda-nav-left-' + sliderCount + '"><a href="#">' + settings.dynamicArrowLeftText + '</a></div>');
			slider.after('<div class="coda-nav-right" id="coda-nav-right-' + sliderCount + '"><a href="#">' + settings.dynamicArrowRightText + '</a></div>');
		};
		
		// Surround the collection of panel divs with a container div (wide enough for all panels to be lined up end-to-end)
		$('.panel', slider).wrapAll('<div class="panel-container"></div>');
		// Specify the width of the container div (wide enough for all panels to be lined up end-to-end)
		$(".panel-container", slider).css({ "width": panelContainerWidth });
		
		// Specify the current panel.
		// If the loaded URL has a hash (cross-linking), we're going to use that hash to give the slider a specific starting position...
		if (settings.crossLinking && location.hash && parseInt(location.hash.slice(1)) <= panelCount) {
			currentPanel = parseInt(location.hash.slice(1));
			offset = - (panelWidth*(currentPanel - 1));
			$('.panel-container', slider).css({ "marginLeft": offset });
		// If that's not the case, check to see if we're supposed to load a panel other than Panel 1 initially...
		} else if (settings.firstPanelToLoad != 1 && settings.firstPanelToLoad <= panelCount) { 
			currentPanel = settings.firstPanelToLoad;
			offset = - (panelWidth*(currentPanel - 1));
			$('.panel-container', slider).css({ "marginLeft": offset });
		// Otherwise, we'll just set the current panel to 1...
		} else { 
			currentPanel = 1;
		};
			
		// Left arrow click
		$("#coda-nav-left-" + sliderCount + " a").click(function(){
			navClicks++;
			if (currentPanel == 1 && !settings.carousel) {
				offset = - (panelWidth*(panelCount - 1));
				alterPanelHeight(panelCount - 1);
				currentPanel = panelCount;
				slider.siblings('.coda-nav').find('a.current').removeClass('current').parents('ul').find('li:last a').addClass('current');
			} else if (currentPanel == 1 && settings.carousel) {
				last = true;
				offset = 0;
				alterPanelHeight(panelCount - 1);
				currentPanel = panelCount;
				slider.find('.panel:last-child').clone().addClass('duplicate').prependTo('.panel-container');
				$('.panel-container', slider).css("marginLeft", -panelWidth);
				slider.siblings('.coda-nav').find('a.current').removeClass('current').parents('ul').find('li:last a').addClass('current');
			} else {
				currentPanel -= 1;
				alterPanelHeight(currentPanel - 1);
				offset = - (panelWidth*(currentPanel - 1));
				slider.siblings('.coda-nav').find('a.current').removeClass('current').parent().prev().find('a').addClass('current');
			};
			$('.panel-container', slider).stop().animate({ "marginLeft": offset }, settings.slideEaseDuration, settings.slideEaseFunction, function() {
				if (settings.carousel && last) {
					last = false;
					$(this).css( "marginLeft", -(panelWidth*(panelCount - 1)) ).find('.panel.duplicate').remove();
				}
			});
			if (settings.crossLinking) { location.hash = currentPanel }; // Change the URL hash (cross-linking)
			return false;
		});
			
		// Right arrow click
		$('#coda-nav-right-' + sliderCount + ' a').click(function(){
			navClicks++;
			if (currentPanel == panelCount && !settings.carousel) {
				offset = 0;
				currentPanel = 1;
				alterPanelHeight(0);
				slider.siblings('.coda-nav').find('a.current').removeClass('current').parents('ul').find('a:eq(0)').addClass('current');
			} else if (currentPanel == panelCount && settings.carousel) {
				last = true;
				offset = - (panelWidth*panelCount);
				currentPanel = 1;
				alterPanelHeight(0);
				slider.find('.panel:first-child').clone().addClass('duplicate').appendTo('.panel-container');
				slider.siblings('.coda-nav').find('a.current').removeClass('current').parents('ul').find('a:eq(0)').addClass('current');
			} else {
				offset = - (panelWidth*currentPanel);
				alterPanelHeight(currentPanel);
				currentPanel += 1;
				slider.siblings('.coda-nav').find('a.current').removeClass('current').parent().next().find('a').addClass('current');
			};
			$('.panel-container', slider).stop().animate({ "marginLeft": offset }, settings.slideEaseDuration, settings.slideEaseFunction, function() {
				if (settings.carousel && last) {
					last = false;
					$(this).css( "marginLeft", (panelWidth*(currentPanel-1)) ).find('.panel.duplicate').remove();
				}
			});
			if (settings.crossLinking) { location.hash = currentPanel }; // Change the URL hash (cross-linking)
			return false;
		});
		
		// If we need a dynamic menu
		if (settings.dynamicTabs) {
			dynamicTabs = '<div class="coda-nav" id="coda-nav-' + sliderCount + '"><ul></ul></div>';
			if (settings.dynamicTabsPosition === "bottom") {
				slider.parent().append(dynamicTabs);
			} else {
				slider.parent().prepend(dynamicTabs);
			}
			ul = $('#coda-nav-' + sliderCount + ' ul');
			// Create the nav items
			$('.panel', slider).each(function(n) {
				ul.append('<li class="tab' + (n+1) + '"><a href="#' + (n+1) + '">' + $(this).find(settings.panelTitleSelector).text() + '</a></li>');												
			});
			navContainerWidth = slider.width() + slider.siblings('.coda-nav-left').width() + slider.siblings('.coda-nav-right').width();
			ul.parent().css({ "width": navContainerWidth });
			switch (settings.dynamicTabsAlign) {
				case "center":
					ul.children().each(function(index){
						dynamicNavWidth += $(ul.children()[index]).outerWidth();
					});
					ul.css({ "width": dynamicNavWidth });
					break;
				case "right":
					ul.css({ "float": "right" });
					break;
			};
		};
			
		// If we need a tabbed nav
		$('#coda-nav-' + sliderCount + ' a').each(function(z) {
			// What happens when a nav link is clicked
			$(this).bind("click", function() {
				navClicks++;
				$(this).addClass('current').parents('ul').find('a').not($(this)).removeClass('current');
				offset = - (panelWidth*z);
				alterPanelHeight(z);
				currentPanel = z + 1;
				$('.panel-container', slider).stop().animate({ "marginLeft": offset }, settings.slideEaseDuration, settings.slideEaseFunction);
				if (!settings.crossLinking) { return false }; // Don't change the URL hash unless cross-linking is specified
			});
		});
		
		// External triggers (anywhere on the page)
		$(settings.externalTriggerSelector).each(function() {
			// Make sure this only affects the targeted slider
			if (sliderCount == parseInt($(this).attr("rel").slice(12))) {
				$(this).bind("click", function() {
					navClicks++;
					targetPanel = parseInt($(this).attr("href").slice(1));
					offset = - (panelWidth*(targetPanel - 1));
					alterPanelHeight(targetPanel - 1);
					currentPanel = targetPanel;
					// Switch the current tab:
					slider.siblings('.coda-nav').find('a').removeClass('current').parents('ul').find('li:eq(' + (targetPanel - 1) + ') a').addClass('current');
					// Slide
					$('.panel-container', slider).stop().animate({ "marginLeft": offset }, settings.slideEaseDuration, settings.slideEaseFunction);
					if (!settings.crossLinking) { return false }; // Don't change the URL hash unless cross-linking is specified
				});
			};
		});
			
		// Specify which tab is initially set to "current". Depends on if the loaded URL had a hash or not (cross-linking).
		if (settings.crossLinking && location.hash && parseInt(location.hash.slice(1)) <= panelCount) {
			$("#coda-nav-" + sliderCount + " a:eq(" + (location.hash.slice(1) - 1) + ")").addClass("current");
		// If there's no cross-linking, check to see if we're supposed to load a panel other than Panel 1 initially...
		} else if (settings.firstPanelToLoad != 1 && settings.firstPanelToLoad <= panelCount) {
			$("#coda-nav-" + sliderCount + " a:eq(" + (settings.firstPanelToLoad - 1) + ")").addClass("current");
		// Otherwise we must be loading Panel 1, so make the first tab the current one.
		} else {
			$("#coda-nav-" + sliderCount + " a:eq(0)").addClass("current");
		};
		
		// Set the height of the first panel
		if (settings.autoHeight) {
			panelHeight = $('.panel:eq(' + (currentPanel - 1) + ')', slider).height();
			slider.css({ "height": panelHeight });
		};
		
		// Trigger autoSlide
		if (settings.autoSlide) {
			slider.ready(function() {
				setTimeout(autoSlide,settings.autoSlideInterval);
			});
		};
		
		function alterPanelHeight(x) {
			if (settings.autoHeight) {
				panelHeight = $('.panel:eq(' + x + ')', slider).height()
				slider.stop().animate({ "height": panelHeight }, settings.autoHeightEaseDuration, settings.autoHeightEaseFunction);
			};
		};
		
		function autoSlide() {
			var offset;
			
			if (navClicks == 0 || !settings.autoSlideStopWhenClicked) {
				if (currentPanel == panelCount && !settings.carousel) {
					offset = 0;
					currentPanel = 1;
				} else if (currentPanel == panelCount && settings.carousel) {
					last = true;
					offset = - (panelWidth*panelCount);
					currentPanel = 1;
					slider.find('.panel:first-child').clone().addClass('duplicate').appendTo('.panel-container');
					slider.siblings('.coda-nav').find('a.current').removeClass('current').parents('ul').find('a:eq(0)').addClass('current');
				} else {
					offset = - (panelWidth*currentPanel);
					currentPanel += 1;
				};
				alterPanelHeight(currentPanel - 1);
				// Switch the current tab:
				slider.siblings('.coda-nav').find('a').removeClass('current').parents('ul').find('li:eq(' + (currentPanel - 1) + ') a').addClass('current');
				// Slide:
				$('.panel-container', slider).stop().animate({ "marginLeft": offset }, settings.slideEaseDuration, settings.slideEaseFunction, function() {
					if (settings.carousel && last) {
						last = false;
						$(this).css( "marginLeft", (panelWidth*(currentPanel-1)) ).find('.panel.duplicate').remove();
					}
				});
				setTimeout(autoSlide,settings.autoSlideInterval);
			};
		};
		
		// Kill the preloader
		$('.panel', slider).show().end().find("p.loading").remove();
		slider.removeClass("preload");
		
		sliderCount++;
		
	});
};