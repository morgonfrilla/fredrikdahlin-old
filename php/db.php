<?php
	require_once '../../httpd.private/blog_config.php'; // your PHP script(s) can access this, but the rest cannot

	// retrive blogposts from database
	function getBlogPosts() {
		$db = new mysqli(db_host, db_uid, db_pwd, db_name); // open connection
		if ($db->connect_errno) // are we connected properly?
	  		exit("Failed to connect to MySQL: (" . $db->connect_errno . ") " . $db->connect_error); 		
	  	mysqli_set_charset($db, "utf8");


		$sql = "SELECT * FROM posts ORDER BY end_date;";
		$result = $db->query($sql);
		if (!$result) // is there any error?
				exit("MySQL reports " . $db->error);


		$posts = array();
	    while($row = mysqli_fetch_assoc($result)) {
	    	$id = $row["id"];
	    	$title = $row["title"];
	    	$header_title = $row["header_title"];
	    	$start_date = $row["start_date"];
	    	$end_date = $row["end_date"];
	    	$text = $row["text"];
	    	$sidebar = $row["sidebar"];

	    	array_push($posts, array($id, $title, $header_title, $start_date, $end_date, $text, $sidebar));
	    }


		$db->close(); // close connection
		echo json_encode($posts);
	}



	/************************************************************
	HTTP GET REQUESTS
	************************************************************/
	$cmd = $_GET['cmd'];


	if(!empty($_GET["cmd"])) {
		switch ($cmd) {
			case "get_blog_posts":
				echo getBlogPosts();
				break;

			default:
				echo $cmd;
		}
	}
?>