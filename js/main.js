$(function() {
	tweetGallery.init();
	
});
var tweetGallery = {
	options : {
		screen_names : [
			'nathanaelnsmith',
			'_ifnull'
		],
		gallery_hash : '#testgallery',
		refresh : 60 * 1000
	},
	init : function () {
		tweetGallery.getTweets();
	},
	photos : new Array(),
	getTweets : function () {
		var pullCount = 0;
		for (var i = 0; i < tweetGallery.options.screen_names.length; i++) {
			$.ajax({
				url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + tweetGallery.options.screen_names[i] + '&include_entities=true&callback=?',
				dataType: 'jsonp',
				success: function(data) {
					pullCount++;
					tweetGallery.photos = tweetGallery.photos.concat(tweetGallery.filterByHashtag(data));
					if (pullCount == tweetGallery.options.screen_names.length) {
						tweetGallery.makeList();
						
						$('#slider').tinySlider({auto: true, pause: false, nav: false});
						
						$(window).resize(function(){
							$('.vert-center li').css('line-height',$(window).height() + 'px');
						});
						
						var refresh = setInterval( function(){
							tweetGallery.checkNewTweets();
							}, tweetGallery.options.refresh);
					}
				}
			});
		}
	},
	filterByHashtag : function (data) {
		var temp = new Array();
		tweetsLoop:
		for (var i = 0, hasHash; i < data.length; i++, hasHash = 0) {
			// check if tweet has already been added
			if (tweetGallery.photos.length > 0) {
				photosLoop:
				for(var k = 0; k < tweetGallery.photos.length; k++) {
					if (data[i].id == tweetGallery.photos[k].tweet_id) {
						break tweetsLoop;
					}
				}
			}
			// check if tweet contains a gallery hash
			for (var j = 0; j < data[i].entities.hashtags.length; j++) {
				if (data[i].entities.hashtags[j].text == tweetGallery.options.gallery_hash.substring(1)) {
					hasHash = 1;
				}
			}
			if (hasHash) {
				temp.push({'url': data[i].entities.media[0].media_url, 'tweet_id': data[i].id});
			}
		}
		return temp;
	},
	makeList : function () {
		for(var i = 0; i < tweetGallery.photos.length; i++) {
			$('#slider .slides').append('<li style="line-height:' + $(window).height() + 'px' + '"><img src="' + tweetGallery.photos[i].url + '" alt="" /></li>');
		}
	},
	checkNewTweets : function () {
		console.log('checking for new tweets...');
		for (var i = 0; i < tweetGallery.options.screen_names.length; i++) {
			$.ajax({
				url: 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=' + tweetGallery.options.screen_names[i] + '&include_entities=true&callback=?',
				dataType: 'jsonp',
				success: function(data) {
					var temp = tweetGallery.filterByHashtag(data).reverse();
					tweetGallery.photos = temp.concat(tweetGallery.photos);
					for(var i = 0; i < temp.length; i++) {
						$('#slider .slides').prepend('<li style="line-height:' + $(window).height() + 'px' + '"><img src="' + temp[i].url + '" alt="" /></li>');
					}
				}
			});
		}
	}
}