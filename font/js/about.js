$(function() {

	$('.about button').click(function() { 
		$('.about').toggleClass('open');
	});



	$("#timeline image").click(function() {
		console.log("clicked picture");
		var post = parseInt($( this ).attr('post'));
		var title = $(this).attr('title');
		$(this).removeClass('inactive-button');
		$(this).addClass('active-button');
		

		var left = 100 * (post-1);	
		$('.post_container').css("left", "-"+left+"%");
		$('.post').toggleClass('moving');
		

	    setTimeout(function(){
	    	$("header h3").text(title);
	        $('.post').removeClass('moving');
	    },3000);
	});



	var curr_post = $("header").text();
	$(".post_button").hover(function() {	
		var title = $(this).attr('title');

		$("header h3").text(title);
	}, function() {
		$("header h3").text(curr_post);
	}
	);

});