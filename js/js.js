
var searchlib = null;
var locationlib = null;
var groupon_data = {};
var position = false;
var sorting = "alpha";

var autocomplete = null;

// Get deals for a certain latitude and longitude and radius (optional)
function getDeals(lat, lng, radius) {
	
	if(typeof(radius) === "undefined") {
		radius = 100;
	}
	
	$.get("groupon.php", {
		"lat": lat,
		"lng": lng,
		"radius": radius
	}, function(data) {
		groupon_data = JSON.parse(data);
		
		buildLib(groupon_data);
		
		autoComplete("#merchantsearch","#merchantdisp",searchlib);
	});

}

// Gets the user's current location (with their permission of course)
function getLocation(radius) {

	// Call the navigator geolocation API
	if (navigator.geolocation) {
	
		navigator.geolocation.getCurrentPosition(function(loc) {
			
			position = {
				lat:loc.coords.latitude,
				lng:loc.coords.longitude
			};
			
			$("#overlay").fadeOut();
			$("#location").html("Yours");
			
			// Get the deals
			getDeals(position.lat, position.lng, radius);
			
		});
		
	} else {
		return false;
	}
}

// Creating the dictionaries for autocomplete and linking latitude/longitude
function buildLib(data) {

	if(typeof(data.deals) === "undefined") {
		searchlib = [];
		locationlib = {};
		return {};
	}
	
	// First build directory of locations and their long/lats
	var locs = {};
	for(var i=0;i<data.deals.length;i++) {
	
		// Check to make sure entry has locations
		var rdl = data.deals[i].options[0];
		if(typeof(rdl) === "undefined") {
			continue;
		}
		
		// Skip entry if no name
		var key = data.deals[i].merchant.name;
		if(typeof(key) === "undefined" || key == "") continue;
		
		// Get rid of silly quotes
		key = key.replace(/"/g, '');
		
		// Skip entry if online deal
		if(data.deals[i].redemptionLocation == "Online Deal") continue;
	
		// Get all the locations (in terms of lat and lng)
		locs[key] = [];
		for(var j=0;j<rdl.redemptionLocations.length;j++) {
			locs[key].push({
				lat: rdl.redemptionLocations[j].lat,
				lng: rdl.redemptionLocations[j].lng
			});
		}	
		
	}
	
	// Set the location library
	locationlib = locs;
	
	// Init the search lib
	searchlib = [];
	
	for(var i=0;i<data.deals.length;i++) {
		// Skip entry if no name
		var key = data.deals[i].merchant.name;
		if(typeof(key) === "undefined" || key == "") continue;
		key = key.replace(/"/g, '');
		
		searchlib.push({
			value: key,
			desc: data.deals[i].title,
			url: data.deals[i].dealUrl
		});
		
	}
	
	return searchlib;
	
}

// Given an array of data objects, will sort them by item.value
function sortAlpha(data) {
	return data.sort(function(a, b) {
		return a.value.toLowerCase().localeCompare(b.value.toLowerCase());
	});
}

// Given an array of data objects, will create location objects and sort them by distance
// from the global position
// If a deal has multiple locations, give the deal with the closest location
// If deal is online, will ignore
function sortDistance(data) {

	var toSort = [];
	for(var i=0;i<data.length;i++) {
		if(typeof(locationlib[data[i].value]) === "undefined") continue;
		toSort.push(data[i]);
	}
	
	return toSort.sort(function(a,b) {
		return distance(minDist(locationlib[a.value], position), position) - 
				distance(minDist(locationlib[b.value], position), position);
	});
}

// Returns the distance between two positions
function distance(pos1, pos2) {
	return Math.sqrt(Math.pow(pos1.lat - pos2.lat,2) + Math.pow(pos1.lng - pos2.lng, 2));
}

// Calculate the minimum distance to a point among several distances
function minDist(locations, toPos) {
	min = {};
	minD = 0;
	for(var i=0;i<locations.length;i++) {
		if(i==0) {
			min = locations[0];
			minD = distance(toPos, locations[0]);
		}
		else {
			var testDist = distance(toPos, locations[i]);
			if(testDist < minD) {
				min = locations[i];
				minD = testDist;
			}
		}
	}
	return min;
}

// Check the location, if set then use it as position
function getUserPlace() {
	var place = autocomplete.getPlace();

	if (typeof(place)==="undefined" || !place.geometry) {
		$("#invalid-location").show();
		window.setTimeout(function() {
			$("#invalid-location").hide();
		}, 4000);
		return false;
	}
	
	$("#overlay").fadeOut();
	position = {
		"lat":place.geometry.location.lat(),
		"lng":place.geometry.location.lng()
	};
	
	getDeals(position.lat, position.lng);
	$("#location").html($("#autolocation").val());
}

// Implements a simple autocomplete
function autoComplete(el, display, data) {
	$(display).html("<ul id='aclist'></ul>");
	
	$(document).on("keyup",el,function(e) {
	
		var needle = $(el).val().toLowerCase();
	
		// Construct new items based on substring
		var newData = [];
		for(var i=0;i<data.length;i++) {
			if(data[i].value.toLowerCase().indexOf(needle) > -1) {
				newData.push(data[i]);
			}
		}
		
		// Sort it
		if(sorting === "alpha") {
			newData = sortAlpha(newData);
		} else {
			newData = sortDistance(newData);
		}
		
		// Render in order
		$("#aclist").html("");
		
		for(i in newData) {
			var str = "<li class='aclistdata'>";
			
			str += "<div class='acvalue'><a href='"+newData[i].url+"' target='_blank'>"
				+  newData[i].value+"</a></div>";
			str += "<div class='acdesc'>"+newData[i].desc+"</div>";
			
			str += "</li>";
			
			$("#aclist").append(str);
		}
		
		return true;
	});
	
	$(el).trigger("keyup");
}

// Run startup functions
$(document).ready(function() {

	// Set up autocomplete for locations
	var input = document.getElementById('autolocation');
	autocomplete = new google.maps.places.Autocomplete(input, {});
	
	// EVENT HANDLERS
	
	// Changing location
	$(document).on("click", "#changeloc a", function() {
		$("#overlay").fadeIn();
	});
	
	// Change sorting
	$(document).on("click", ".sort", function() {
		$(".sort").removeClass("selected");
		$(this).addClass("selected");
		sorting = $(this).attr("sort");
		
		// And then sort current output
		$("#merchantsearch").trigger("keyup");
	});
	
	$(document).on("click", "#hookmeup", function() {
		getUserPlace();
	});
	
	// Using your own location
	$(document).on("click", "#uselocation", function() {
		getLocation();
	});
	
	
	
});