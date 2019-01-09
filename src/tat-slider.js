var tatSlider = {
	
	resizeTimeout: null,
		
	initialize: function() {
		jQuery(document).ready(this.onReady);
	},
    
    onReady: function() {
    	jQuery('.js-slider').each(function (index) {
			var sliderID = jQuery(this).attr('id'); 
			tatSlider.start(sliderID);		
		});
		jQuery(window).resize(function() {
			clearTimeout(tatSlider.resizeTimeout);
			tatSlider.resizeTimeout = setTimeout( function() { jQuery(this).trigger('resizeEnd'); }, 300);
		});
    },
    
    start: function(sliderID) {
    
    	var autoSlide;
		
		// horizontal or vertical sliding? for vertical data-dir="v"
		var dir = jQuery('#'+sliderID).data('dir');  
			if (dir == undefined) { dir = 'h'; }
		
		// autplay -> to stop set data-auto="false"
		var play = jQuery('#'+sliderID).data('auto');  
			if (play == undefined || play == '1') { play = true; } else { play = false; }
			
		// speed of animation: default is 500 ms
		var speed = jQuery('#'+sliderID).data('speed');  
			if (speed == undefined) { speed = 500; }
		
		// interval between slides: default is 4s
		var interval = jQuery('#'+sliderID).data('interval'); 
			if (interval == undefined) { interval = 5000; }
		
		// how many slides are visible in slider? default is 1; set with data-inview="";
		var slidesInview = 1;		
			var dataInview = jQuery('#'+sliderID).data('inview'); 
				if (dataInview!=undefined && dataInview!='auto') {
					slidesInview = dataInview;
				}
		
		// if navigation is outside slider ID - set data-wrap="wrap-id"
		var sliderWrap = jQuery('#'+sliderID).data('wrap');  
			if (sliderWrap == undefined) { sliderWrap = sliderID; }
		
		// set the first slide in view with class="inview"		
		var currentSlide = jQuery('#'+sliderID+' ul li.inview');
		
		
		var slidesCount = jQuery('#'+sliderID+' ul li').length; 
		var sliderWidth; 
		var sliderUlWidth;
		var sliderUlLeft;
		var slideWidth;
		var slideHeight; // ?
		
		function setSize() {
			
			if (dir=='v') {
			
				sliderWidth = jQuery('#'+sliderID).height();
								
				if (dataInview != undefined && dataInview == 'auto') {
					slideWidth = jQuery('#'+sliderID+' ul li').height(); 
					slidesInview = sliderWidth / slideWidth;
					sliderUlLeft = slideWidth * ( 1 + ( ( 2 - ( slidesInview - Math.floor(slidesInview) ) ) / 2 ) ) ;
				} else {
					slideWidth = sliderWidth / slidesInview;
					jQuery('#'+sliderID+' ul li').css('height',slideWidth);
					sliderUlLeft = slideWidth;
					
				}

				sliderUlWidth = slidesCount * slideWidth;
				jQuery('#'+sliderID+' ul').css({ height: sliderUlWidth, marginTop: - sliderUlLeft });
				
				
				
			} else {
			
				sliderWidth = jQuery('#'+sliderID).width();
				
				if (dataInview != undefined && dataInview == 'auto') {
					slideWidth = jQuery('#'+sliderID+' ul li').width(); 
					slidesInview = sliderWidth / slideWidth;
					sliderUlLeft = slideWidth * ( 1 + ( ( 2 - ( slidesInview - Math.floor(slidesInview) ) ) / 2 ) ) ;
				} else {
					slideWidth = sliderWidth / slidesInview;
					jQuery('#'+sliderID+' ul li').css('width',slideWidth);
					sliderUlLeft = slideWidth;
					
				}

				sliderUlWidth = slidesCount * slideWidth;
				jQuery('#'+sliderID+' ul').css({ width: sliderUlWidth, marginLeft: - sliderUlLeft });
			
			}
		}
		
		setSize();
		
	    jQuery('#'+sliderID+' ul li:last-child').prependTo('#'+sliderID+' ul');
	
	    function moveLeft() {
	    	jQuery(currentSlide).removeClass('inview-pre').prev('li').addClass('inview-pre');

	        if (dir=='v') {
	        	var animate = {top: + slideWidth};
	        	var css = 'top';
	        } else {
	        	var animate = {left: + slideWidth};
	        	var css = 'left';
	        }
        	jQuery('#'+sliderID+' ul').animate(animate, speed, function () {
	            jQuery('#'+sliderID+' ul li:last-child').prependTo('#'+sliderID+' ul');
	            jQuery('#'+sliderID+' ul').css(css, '');
	            jQuery(currentSlide).removeClass('inview');
	            jQuery(currentSlide).prev('li').addClass('inview');
	            moveComplete();
	        });	       	
	    };
	    function moveRight(n) {
	    	jQuery(currentSlide).removeClass('inview-pre').next('li').addClass('inview-pre');
	        
	        var animateWidth = slideWidth * n;
	        
	        if (dir=='v') {
	        	var animate = {top: - animateWidth};
	        	var css = 'top';
	        } else {
	        	var animate = {left: - animateWidth};
	        	var css = 'left';
	        }
	        
	        jQuery('#'+sliderID+' ul').animate(animate, speed, function () {
	        	for (var i=1; i <= n; i++ ) {
	            	jQuery('#'+sliderID+' ul li:first-child').appendTo('#'+sliderID+' ul');
	            }
	            jQuery('#'+sliderID+' ul').css(css, '');
	            jQuery(currentSlide).removeClass('inview');
	            if (n==1) { 
	            	jQuery(currentSlide).next('li').addClass('inview');
	            } else {
	            	jQuery('#'+sliderID+' li:nth-child(2)').addClass('inview');
	            }
	        	moveComplete();
	        });

	    };
	    function moveTo(moveTo) {  
			var moveToSlide = jQuery('#'+moveTo);
			var position = jQuery('#'+sliderID+' li').index(moveToSlide);
			if (position === 0) { 
				moveLeft();
			} else if (position > 1) {
				var n = (position - 1);
				moveRight(n);
			} 
			slideTimer();			
	    };
	    function moveComplete() {
			currentSlide = jQuery('#'+sliderID+' ul li.inview'); 	  
			jQuery('#'+sliderWrap+' .slider-nav').removeClass('active');
			jQuery('*[data-sliderel='+currentSlide.attr('id')+']').addClass('active');
	    }
	    function slideTimer() {
			if (play) { autoSlide = setInterval(function () { jQuery('.slider').stop(true,true);moveRight(1);   }, interval); }
		}
		
		slideTimer();
		
		jQuery('#'+sliderWrap+' .js-move-left').click(function(event) { 
			if (play) {
				clearInterval(autoSlide); 
			}
			moveLeft();  
			slideTimer();
		});
		jQuery('#'+sliderWrap+' .js-move-right').click(function(event) { 
			if (play) {
				clearInterval(autoSlide);
			}
			moveRight(1); 
			slideTimer(); 
		});
		jQuery('#'+sliderWrap+' .js-move-to').click(function(event) { 
			if (play) {
				clearInterval(autoSlide);
			}
			var slide = jQuery(this).data('sliderel');
			moveTo(slide);
		});
		
		jQuery( window ).bind('resizeEnd', function() { setSize(); });
    }

}
tatSlider.initialize();

export { tatSlider as tatSlider }