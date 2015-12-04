$(function () {
	
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
	function insertImage(date, width, start) {
		var img = document.createElementNS('http://www.w3.org/2000/svg','image');
		img.setAttributeNS(null,'height','100');
		img.setAttributeNS(null,'width',width);
		img.setAttributeNS(null,'id','theID');
		img.setAttributeNS(null,'preserveAspectRatio','xMinYMax slice');
		img.setAttributeNS('http://www.w3.org/1999/xlink','href','file:///home/fredrik/Development/travelblog/images/'+date+'/timeline.png');
		img.setAttributeNS(null,'x',start);
		img.setAttributeNS(null,'y','0');
		$('#timeline').append(img);
	}



	// adds a blogpost header to the timeline
	function addBlogPosts() {
		for (var i = 0; i < dates.length; i++) {
			var postDate = new Date(dates[i]);
			var endDate = new Date(dates[i+1]);
			
			if (i+1 == dates.length) {
				endDate = new Date();
			}
			
			timeDiffStart = Math.abs(postDate-startDate);
			diffDaysStart = Math.ceil(timeDiffStart / (1000 * 3600 * 24));

			timeDiffEnd = Math.abs(endDate-startDate);
			diffDaysEnd = Math.ceil(timeDiffEnd / (1000 * 3600 * 24));

			// ser till att bilden blir tillräcklig stor
			if (diffDaysEnd-diffDaysStart < 7) {
				diffDaysEnd += 7;
			}

			var px_start = pixels_per_day*diffDaysStart;
			var px_end = pixels_per_day*diffDaysEnd;
			var px_width = px_end - px_start;
		
			$("#timeline").append("<line class=\"line-post\" x1=\""+px_end+"\" y1=\"10%\" x2=\""+px_end+"\" y2=\"70%\"></line>");
			insertImage(dates[i], px_width, px_start);
		};		
	}


	var months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];
	var startDate = new Date("12/1/2014");
	var today = new Date();
	today.setMonth(today.getMonth() +1);

	var timeDiff = Math.abs(today-startDate);
	var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

	var dates = ["12-22-2014", "1-7-2015", "2-3-2015", "3-2-2015", "3-17-2015"]
	var timeline_length = $("#timeline").width();
	var pixels_per_day = timeline_length/diffDays;

	monthMarkers("12/1/2014");
	addBlogPosts();
	
	$("body").html($("body").html());
});
