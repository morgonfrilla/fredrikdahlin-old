$(function() {
	/***************************************************************************************
	TIMELINE
	***************************************************************************************/
	// marks the months on the timeline
	function monthMarkers(date) {
		var test_date = new Date(date);
		while (test_date.getMonth() != today.getMonth()+1) {
	
			var timeDiff = Math.abs(test_date-startDate);
			var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
			var post_offset = pixels_per_day*diffDays;

			$("#timeline").append("<line class=\"line-month\" x1=\""+post_offset+"\" y1=\"80%\" x2=\""+post_offset+"\" y2=\"85%\"></line>");
			$("#timeline").append("<text x=\""+post_offset+"\" y=\"98%\">"+months[test_date.getMonth()]+"</text>");

			test_date.setMonth(test_date.getMonth()+1);
		}	
	}



	// create the image object and add to timeline
	function insertImage(date, width, start, id, title) {
		var img = document.createElementNS('http://www.w3.org/2000/svg','image');
		img.setAttributeNS(null,'height','100');
		img.setAttributeNS(null,'width',width);
		img.setAttributeNS(null,'post',id);
		img.setAttributeNS(null,'title',title);
		img.setAttributeNS(null,'class', "post-"+id);
		img.setAttributeNS(null,'preserveAspectRatio','xMinYMax slice');
		img.setAttributeNS('http://www.w3.org/1999/xlink','href','images/'+date+'/timeline.png');
		img.setAttributeNS(null,'x',start);
		img.setAttributeNS(null,'y','0');
		$('#timeline').append(img);

		if (id == active_post) {
			$(".post"+-id).css("opacity", 1);
			$("header h3").html(title);
			header_text = title;
		}
	}



	// adds a blogpost header to the timeline
	function addBlogPosts(postStartDate, postEndDate, id, title) {
		timeDiffStart = Math.abs(postStartDate-startDate);
		diffDaysStart = Math.ceil(timeDiffStart / (1000 * 3600 * 24));

		timeDiffEnd = Math.abs(postEndDate-startDate);
		diffDaysEnd = Math.ceil(timeDiffEnd / (1000 * 3600 * 24));

		// ser till att bilden blir tillräcklig stor
		if (diffDaysEnd-diffDaysStart < 7) {
			diffDaysEnd += 7;
		}

		var px_start = pixels_per_day*diffDaysStart;
		var px_end = pixels_per_day*diffDaysEnd;
		var px_width = px_end - px_start;
	
		$("#timeline").append("<line class=\"line-post\" x1=\""+px_end+"\" y1=\"10%\" x2=\""+px_end+"\" y2=\"70%\"></line>");
		
		var d = (postStartDate.getDate()).toString();
		var m = (postStartDate.getMonth()+1).toString();
		var y = (postStartDate.getFullYear()).toString();
		var date = y+"-"+(m[1]?m:"0"+m[0])+"-"+(d[1]?d:"0"+d[0]);
		insertImage(date, px_width, px_start, id, title);
	}


	/***************************************************************************************
	DATABASE
	***************************************************************************************/
	// retrives a post by id
	function getPosts() {
		$.ajax({

		    type: "GET",
		    url: "php/db.php",
		    data: { cmd : "get_blog_posts"},
		    success: function(msg){
		    	//console.log('Response: '+arr+" "+msg); 
		    	var posts = JSON.parse(msg);
		    	
		    	if (posts.length > 0) {

		    		$(".post_container").css("width", "calc("+posts.length+"* 100%)");
		    		$(".post").css("width", "calc(96%/"+posts.length+")");
		    		$(".post").css("margin-left", "calc(4%/"+2*posts.length+")");
		    		$(".post").css("margin-right", "calc(4%/"+2*posts.length+")");


			    	for (var i = 0; i < posts.length; i++) {
				    	id = posts[i][0];
				    	title = posts[i][1];
				    	header_title = posts[i][2];
				    	start_date = posts[i][3];
				    	end_date = posts[i][4];
				    	text = posts[i][5];
				    	sidebar = posts[i][6];

				    	$(".post_container").append("<div class=\"post\"><div class=\"post_header post_header_"+id+"\"><h1>"+title+"</h1></div><div class=\"text\"><section><h2>"+title+"</h2><h3>"+start_date+" till "+end_date+"</h3>"+text+"</div>"+sidebar); 
				    	

				    	$(".post_header_"+id).css("background-size", "cover");
				    	$(".post_header_"+id).css("background-position", "center");
				    	$(".post_header_"+id).css("background-image", "url(\"images/"+start_date+"/header.jpg\")"); 


				    	var tempPostStartDate = start_date.split("-");
				    	var tempPostEndDate = end_date.split("-");

				    	postStartDate = new Date(tempPostStartDate[0]+"/"+tempPostStartDate[1]+"/"+tempPostStartDate[2]);
				    	postEndDate = new Date(tempPostEndDate[0]+"/"+tempPostEndDate[1]+"/"+tempPostEndDate[2]);
				    	
				    	if (i+1 == posts.length) {
							postEndDate = new Date();
						}

				    	addBlogPosts(postStartDate, postEndDate, id, title);
				    }   		    		
		    	}
		    }

		}); // Ajax Call	
	}


	/***************************************************************************************
	BUTTONS
	***************************************************************************************/
	$('.about button').click(function() { 
		$('.about').toggleClass('open');
	});



	// Handles click events on the images
	$(document).on('click', '#timeline image', function(){
		var post = parseInt($( this ).attr('post'));
		var title = $(this).attr('title');

		var left = 100 * (post-1);	
		
		$(".post-"+active_post).css("opacity", 0.7);
		$(this).css("opacity", 1);

		active_post = post;
		header_text = title;

		$('.post_container').css("left", "-"+left+"%");
		$('.post').toggleClass('moving');
		$("header h3").html(title);

	    setTimeout(function(){
	        $('.post').removeClass('moving');
	    },3000);
	});


	// change the text if mouseover
	$(document).on('mouseover', '#timeline image', function(){
		console.log("hover");	
		$('header h3').html($(this).attr("title"));
	});


	// change the text if mouseover
	$(document).on('mouseout', '#timeline image', function(){
		$('header h3').html(header_text);
	});


	/***************************************************************************************
	VARIABLES
	***************************************************************************************/
	var header_text = "";
	var active_post = 1;

	var months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
	var startDate = new Date("12/1/2014");
	var today = new Date();
	today.setMonth(today.getMonth() +1);

	var timeDiff = Math.abs(today-startDate);
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

	var dates = []
	var timeline_length = $("#timeline").width();
	var pixels_per_day = timeline_length/diffDays;

	getPosts();
	monthMarkers("12/1/2014");

	$("body").html($("body").html());
});
