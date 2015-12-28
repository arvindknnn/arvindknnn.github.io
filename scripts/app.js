var app = app || {};
var deviceType ={};


$(function() {	
	app.init = function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(setLocation, setDefaultLocation);
	}
	else {
		console.log("Geo location not available for your browser, setting defaults");
		setDefaultLocation({code: 1});
	}

	function setLocation(geo) {
		app.geo = true;
	    app.maps.geo.lat = geo.coords.latitude;
	    app.maps.geo.lng = geo.coords.longitude;
	    app.maps.geo.zoom = 15;

		initModel();
	}

	function setDefaultLocation(errorCode) {
	  	if (errorCode.code == 1) {
			app.geo = false;
			initModel();
		}    
	}

	function initModel() {
	    // Initiate the model and bind to view
		app.model = new app.Model();
		app.model.geoPresent(app.geo);
		app.geo && app.model.ready(app.maps.initMap);     	
		$(".dropdown-toggle").dropdown();
	   }
	};

	// Device Type Detection
	var devices="";

// addModal();

});