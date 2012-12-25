(function( $ ) {
	$.fn.tinySlider = function( options ) {
		
		var settings = $.extend({
			container : this,
			slideHolder : "ul",
			slide : "li",
			slideNav : ".nav .wrapper",
			arrowsWrap : ".arrows",
			navBtns : {
				left : "a.prev",
				right : "a.next",
				slide : "a"	
			},
			slideCount : function () {
				return this.container.find(this.slideHolder + ' ' + this.slide).length;
			},
			slideWidth : function () {
				return this.container.find(this.slideHolder + ' ' + this.slide).width();
			},
			isAnimating : 0,
			speed : 200,
			auto : true,
			delay : 6000,
			nav : true,
			pause : true
		}, options);
		
		// Hide nav when only one image or nav is disabled
		if (settings.slideCount() == 1 || settings.nav == false) {
			settings.container.find(settings.arrowsWrap + ',' + settings.slideNav).hide();
		}
		if (settings.slideCount() == 1) {
			settings.auto = false;
		}
		// Create nav buttons
		for(var i = 0; i < settings.slideCount(); i++) {
			$(settings.slideNav).append("<" + settings.navBtns.slide + " data-slide-id='" + i + "' href='#'>" + i + "</" + settings.navBtns.slide + ">");
		}
		// Set active states
		settings.container.find(settings.slideHolder + ' ' + settings.slide + ":first-child").addClass('active');
		settings.container.find(settings.slideNav + ' ' + settings.navBtns.slide + ":first-child").addClass('active');
		// Bind navigation
		settings.container.find(settings.navBtns.right).click(function(e){
			if(!settings.isAnimating) {
				e.preventDefault();
				nextSlide('right');
			}
		});
		settings.container.find(settings.navBtns.left).click(function(e){
			if(!settings.isAnimating) {
				e.preventDefault();
				nextSlide('left');
			}
		});
		settings.container.find(settings.slideNav).children().click(function(e){
			if(!settings.isAnimating) {
				e.preventDefault();
				nextSlide(parseInt($(this).attr('data-slide-id')));
			}
		});
		var autoRotate = function (action) {
			action = (typeof action !== 'undefined') ? action : 'play';
			if(action == 'pause') {
				clearInterval(auto);
			} else {
				auto = window.setInterval( function() { 
					nextSlide('right');  
				}, settings.delay);
			}
		}
		
		var nextSlide = function (direction) {
			var currentSlide = settings.container.find(settings.slideHolder + ' ' + settings.slide + '.active').index(), nextSlide, animateFrom, animateTo;
			settings.isAnimating = 1;
			if(typeof direction === 'number') {
				nextSlide = direction;
				direction = (nextSlide > currentSlide) ? 'right' : 'left';
			}
			if (direction == 'right') {
				if (typeof nextSlide !== 'number') {
					nextSlide = (currentSlide == (settings.slideCount() - 1)) ? 0 : currentSlide + 1;
				}
				animateFrom = settings.slideWidth();
				animateTo = '-=' + settings.slideWidth();
			} else {
				if (typeof nextSlide !== 'number') {
					nextSlide = (currentSlide == 0) ? settings.slideCount() - 1 : currentSlide - 1;
				}
				animateFrom = -settings.slideWidth();
				animateTo = '+=' + settings.slideWidth();
			}
			// Animate next slide
			settings.container.find(settings.slideHolder + ' ' + settings.slide +  ':eq(' + nextSlide + ')')
			  .css('left',animateFrom)
			  .show()
			  .animate({
			  		left: animateTo
			    }, settings.speed, 
			    function() {
				    $(this).addClass('active');
				    settings.isAnimating = 0;
				    settings.container.find(settings.slideNav + ' ' + settings.navBtns.slide + ":eq(" + nextSlide + ")").addClass('active').siblings().removeClass('active');
			  });
			// Animate active slide
			settings.container.find(settings.slideHolder + ' ' + settings.slide + '.active').animate({
			    left: animateTo
			  }, settings.speed, function() {
			    $(this).removeClass('active').hide();
			});
		}
		
		// Start auto rotate
		$(function(){
			if (settings.auto) {
				autoRotate();
				if (settings.pause) {
	  				settings.container.hover(function(){ 
	  					autoRotate('pause');
	  				}, function() {
	  					autoRotate();
	  				});
				}
			}			
		});
		
	};
})( jQuery );