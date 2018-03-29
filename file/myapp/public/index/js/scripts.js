( function () {
	"use strict";


	$( '#testimonial_one' )
		.owlCarousel( {
			autoplay: true,
			loop: true,
			margin:10,
	        pagination: false,
	        dots: false,
	        nav: true,
	        responsiveClass:true,
	        singleItem:false,
	        navText:[
	            "<i class='icofont icofont-long-arrow-left'></i>",
	            "<i class='icofont icofont-long-arrow-right'></i>"
	        ],
			responsive: {
				0: {
					items: 1
				},
				600: {
					items: 3
				},
				1000: {
					items: 6
				}
			}
		} );


	 /*
    -------------------
    Ticker
    -------------------*/
    if ($('#webticker-dark-icons')
        .length) {
        $("#webticker-dark-icons")
            .webTicker({
                height: 'auto',
                duplicate: true,
                startEmpty: false,
                rssfrequency: 5
            });
	};
	
	 /*
    -------------------
    ScrollIt
    -------------------*/
	$.scrollIt({
        upKey: 38, // key code to navigate to the next section
        downKey: 40, // key code to navigate to the previous section
        easing: 'linear', // the easing function for animation
        scrollTime: 1000, // how long (in ms) the animation takes
        activeClass: 'active', // class given to the active nav element
        onPageChange: null, // function(pageIndex) that is called when page is changed
        topOffset: 0 // offste (in px) for fixed top navigation
    });

    	




} )( jQuery );


$(window).scroll(function () {
    if ($(this).scrollTop() > 1) {
        $('.header').addClass("sticky");
    } else {
        $('.header').removeClass("sticky");
    }
});