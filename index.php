<?php

?>

<html>
<head>

<title>Groupon API</title>
	
<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="css/bootstrap-responsive.min.css">
<link rel="stylesheet" type="text/css" href="css/style.css">

<script type="text/javascript" src="js/lib/jquery.min.js"> </script><style type="text/css"></style>
<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?libraries=places&sensor=false"></script>
<script type="text/javascript" src="js/lib/bootstrap.min.js"> </script>
<script type="text/javascript" src="js/js.js"> </script>
	
</head>

<body>

<div id="content" class="span7">

	<div id="merchants">
	
		<div id="sort-wrapper">
			<div id="changeloc">Location: <span id="location"></span> -- <a>Wrong place?</a></div>
		
			<div class="sort" sort="dist">Proximity</div>
			<div class="sort selected" sort="alpha">Alphabetical</div> 
		</div>
		
		<input id="merchantsearch" type="text" placeholder="Search through deals">
		</input>
		
		<div id="merchantdisp">
			
		</div>
	
	</div>

</div>

<div id="overlay">
	
	<div id="location-search" class="span7">
	
		<div id="search-wrapper" class="span6">
		
			<input id="autolocation" class="span4" type="text" placeholder="Where do you want your deals?"></input>
			
			<button id="hookmeup" class="btn btn-flat">Hook Me Up!</button>
			
			<br>
			<span class='span4'>or <a id="uselocation">use my location</a>.</span>
			
			<br><br>
			<div class='span4' id="invalid-location">Sorry, that is not a valid location. ):</div>
		</div>
	
	</div>

</div>

</body>

</html>