$.preloadImages = function(images) {
	$(images).each(function() {
		$('<img />')[0].src = this
		_gaq.push(['_trackEvent', 'images', 'preloaded', this]);
	});
}

$.imageUrlFor = function(image) {
	return "/assets/images/" + image;
}

$.fn.releaseData = function() {
	return { 
		artist: this.data('artist'),
		album:  this.data('album'), 
		format: this.data('format'),
		year:   this.data('year')
	}
}

$.fn.updateReleaseData = function() {
	$information = $('#information');
	$artist      = $information.find('.artist');
	$album       = $information.find('.album');
	$format      = $information.find('.format');
	$year        = $information.find('.year');
	
	releaseData  = $(this).releaseData();
	
	$artist.text(releaseData.artist);
	$album.text(releaseData.album);
	$format.text(releaseData.format);
	$year.text(releaseData.year);
	
	return this
}

$(document).ready(function() {
	images = $('a.artist_link').map(function() { return $.imageUrlFor($(this).data('image')) });
	$.preloadImages(images);
	
	$(document).on({
		mouseenter: function() {
			var slowFadeDuration = 1000;
			var $imageView;
			
			// create an image view unless one exists
			if (!$(this).data('imageView')) {
				$imageView = $('<div class="image"></div>').css('background-image', 'url(' + $.imageUrlFor($(this).data('image')) + ')');
				$(this).data('imageView', $imageView);
			} else {
				$imageView = $(this).data('imageView');
			}
			
			$imageView
				.prependTo('#image_holder')
				.hide()
				.delay(200)
				.stop(true, true)
				.css({height: '101%', width: '101%'})
				.css({display: 'block', opacity: 0.0})
				.animate({opacity: '1.0', height: '100%', width: '100%'}, slowFadeDuration, 'easeInOutCubic');
				
			$(this)
				.delay(200)
				.stop(true, true)
				.updateReleaseData()
				.animate({color: '#eee'}, slowFadeDuration, 'easeInOutCubic');
				
			$('#information')
				.delay(200)
				.stop(true, true)
				.fadeIn(1600);
				
			$('#overlay')
				.delay(200)
				.stop(true, true)
				.fadeIn(1600);
				
			$('#logo_container')
				.delay(200)
				.stop(true, true)
				.animate({opacity: 0.8}, 600)
				.addClass('white');
				
			$('#logo_text .logo_text')
				.delay(200)
				.stop(true, true)
				.fadeOut(1000);
		},
		mouseleave: function() {
			var slowFadeDuration = 1000;
			var $imageView = $(this).data('imageView');
			//stuff to do on mouseleave
			$imageView
				.delay(200)
				.stop(true, true)
				.animate({opacity: '0.0', height: '101%', width: '101%'}, slowFadeDuration, 'easeInOutCubic');
				
			$(this).animate({color: '#333'}, slowFadeDuration, 'easeInOutCubic');
			
			$('#overlay, #information')
				.delay(200)
				.stop(true, true)
				.fadeOut(1600);
			
			$('#logo_container')
				.delay(200)
				.stop(true, true)
				.animate({opacity: 1.0}, 600)
				.removeClass('white');
				
			$('#logo_text .logo_text').delay(200).fadeIn(1000);
		}
	}, 'a.artist_link');
});