
var app = app || {};
    app.maps = app.maps || {};


(function(x) {
  var self = app.maps;
  self.mapDiv = $("#map")[0];
  self.searchBox = $('#pac-input')[0];
  self.geo = {};
  self.handleListAndMarkerEvent = function(obj) {


    if (obj.eventType === "mouseover") {
      if (typeof(obj.place.itemCss) === "function") {
        obj.place.itemCss("search-result-data-hover");
      }
      if (typeof(obj.place.itemCss) === "string") {      
        obj.place.itemCss = "search-result-data-hover";
        ko.mapping.fromJS(self.places, app.model.googlePlaces);      
      }      

      var infoContent = '<div class="search-result-data" data-toggle="modal" data-target="#locInfoModal">' +
        '<img src="'+ obj.place.icon + '" class="img-responsive loc-icon" alt="Icon">' +
        '<div class="icon-container"> <h4>' +          
        obj.place.name +
        '</h4><div>' +
        obj.place.formatted_address +
        '</div></div></div>';

      self.infowindow.setContent(infoContent);          
      self.infowindow.open(self.map, obj.marker);

      $(".search-result-data-hover")[0].scrollIntoView(false);


    }
    else if (obj.eventType === "mouseout") {
      if (typeof(obj.place.itemCss) === "function") {
        obj.place.itemCss("");
      }
      if (typeof(obj.place.itemCss) === "string") {      
        obj.place.itemCss = "";
        ko.mapping.fromJS(self.places, app.model.googlePlaces);      
      }    
      self.infowindow.close(self.map, obj.marker);
    }
    else if (obj.eventType === "click") {      
      self.infowindow.close(self.map, obj.marker);          
      app.service.getLocInfo(obj.place,obj.eventType,"mapMarker");
      // $('#locInfoModal').modal('handleUpdate');
      $('#locInfoModal').modal('show');
    }
  };

  self.renderMap = function() {
    var map = new google.maps.Map(self.mapDiv, {
      center: self.geo,
      zoom: self.geo.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    app.maps.map = map;

  self.mapService = new google.maps.places.PlacesService(map);

    // Create the search box and link it to the UI element.
    // var input = $('#pac-input')[0];
    var searchBox = new google.maps.places.SearchBox(self.searchBox);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(self.searchBox);


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());      
    });

    self.markers = [];    
    var infowindow = new google.maps.InfoWindow();
    self.infowindow = infowindow;

    // [START region_getplaces]
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      // var places = searchBox.getPlaces();
      self.places = searchBox.getPlaces();
      // console.log("maps: " + self.places());
      self.resultsLength = self.places.length;

     
    

      if (self.places.length == 0) {
        return;
      }

      // Clear out the old markers.
      self.markers.forEach(function(marker) {
        marker.setMap(null);
      });
      self.markers = [];

      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      
      self.places.forEach(function(place) {

        place.itemCss = ko.observable("");

        // app.model.assignSearchResultsClass();

        var icon = {
          url: place.icon,
          size: new google.maps.Size(25, 25),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 25),
          scaledSize: new google.maps.Size(25, 25)
        };

        //Create a marker for each place.
        var marker =  new google.maps.Marker({
          map: map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        });

        self.markers.push(marker);

        google.maps.event.addListener(marker, 'mouseover', function() {
          // infowindow.setContent(place.name);
          // marker.setAnimation(google.maps.Animation.BOUNCE);
          var eventObj = {};
          eventObj.place = place;
          eventObj.marker = marker;
          eventObj.eventType = "mouseover";
          eventObj.origin = "marker";
          self.handleListAndMarkerEvent(eventObj);
        });

        google.maps.event.addListener(marker, 'mouseout', function() {
          // marker.setAnimation(null);
          var eventObj = {};
          eventObj.place = place;
          eventObj.marker = marker;
          eventObj.eventType = "mouseout";
          eventObj.origin = "marker";
          self.handleListAndMarkerEvent(eventObj);

        });

        google.maps.event.addListener(marker, 'click', function(event) {
          var eventObj = {};
          eventObj.place = place;
          eventObj.marker = marker;
          eventObj.eventType = "click";
          eventObj.origin = "marker";          
          self.handleListAndMarkerEvent(eventObj);
        });



        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });


      // Every time data is received from the server, map search results to data model
      // ko.mapping.fromJS(self.places, app.model.maps.places);
      ko.mapping.fromJS(self.places, app.model.googlePlaces);
      app.model.resultsLen(self.resultsLength);
      // ko.mapping.fromJS(self.resultsLength, app.model.resultsLen);

      map.fitBounds(bounds);

    });
    // [END region_getplaces]
    app.model.mapLoaded(true);
    $('#pac-input').removeClass("hidden"); 
    $('.search-list').removeClass("hidden"); 

    

  };  
  })(this);