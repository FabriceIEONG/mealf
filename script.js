/* CAROUSEL functions */
$('.carousel').slick({
	draggable: true,
	mobileFirst: true,
	slidesToShow: 1,
	slidesToScroll: 1,
	responsive: [
	{
    	breakpoint: 720,
    	settings: {
        slidesToShow: 2,
        slidesToScroll: 2
		}
    },
    {
    	breakpoint: 1024,
    	settings: {
        slidesToShow: 3,
        slidesToScroll: 3
		}
    }
  	]
});
