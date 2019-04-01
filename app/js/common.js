$(document).ready(function() {
	$('.popup').magnificPopup({
		type: 'inline',
		preloader: false,
		focus: '#text',

		// When elemened is focused, some mobile browsers in some cases zoom in
		// It looks not nice, so we disable it:
		callbacks: {
			beforeOpen: function() {
				if($(window).width() < 700) {
					this.st.focus = false;
				} else {
					this.st.focus = '#text';
				}
			}
		}
	});
});

// Карусель.

$(document).ready(function(){
	$(".owl-carousel").owlCarousel({
	//	nav:true,
		loop:true,
		center: true,
	//	autoWidth:true,
	//	items:1,
	//	autoplay:true,
	//	autoplayTimeout:2000,
	//	smartSpeed:1900,
		responsive: {0:{items:1}, 500:{items:2, center:false}, 900:{items:3}},
	});
});
