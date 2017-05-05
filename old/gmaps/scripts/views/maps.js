
var app = app || {};
    app.maps = app.maps || {};


(function(x) {
  var self = app.maps,
      map, 
      searchBox;
      

  self.mapDiv = $("#map")[0];
  self.searchBox = $('#pac-input')[0];
  self.geo = {};  

  self.initMap = function () {
    map = new google.maps.Map(self.mapDiv, {
      center: self.geo,
      zoom: self.geo.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });    
    app.maps.map = map;    
    self.mapService = new google.maps.places.PlacesService(map);
    searchBox = new google.maps.places.SearchBox(self.searchBox);

    map.addListener('idle', function() {
      self.geo.lat = map.getCenter().lat();
      self.geo.lng = map.getCenter().lng();
      // self.renderMap();
      // self.renderMap(self.places);
    });

    self.markers = [];    
    var infowindow = new google.maps.InfoWindow();
    self.infowindow = infowindow;

    self.mapService.nearbySearch({
      location: self.geo,
      radius: 500
      }, function (results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            self.places = results;
            self.resultsLength = self.places.length;        

            if (self.places.length == 0) {
              return;
            }
            var rmapRendered = self.renderMap(self.places, false);

       // Every time data is received from the server, map search results to data model
      // ko.mapping.fromJS(self.places, app.model.maps.places);

            ko.mapping.fromJS(self.places, app.model.googlePlaces);
            app.model.resultsLen(self.resultsLength);            
            
          }        
        });
      
      $('#pac-input').removeClass("hidden"); 
      $('.search-list').removeClass("hidden");
      $("#result-filter-text").keydown(function(){
        app.model.filteredInput(true);
      });
      $("#result-filter-text").keyup(function(){
        app.model.filteredInput(false);
      });
  }

    self.renderMap = function(placesData, filtered) {
       // Clear out the old markers.
      self.markers.forEach(function(marker) {
        marker.setMap(null);
      });
      self.markers = [];
    // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
       placesData.forEach(function(place, index) {
        // if( !filtered ) {
          place.itemCss = ko.observable("");
        // }
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
          position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
        });

        self.markers.push(marker);
        google.maps.event.addListener(marker, 'mouseover', function() {
          // infowindow.setContent(place.name);
          // marker.setAnimation(google.maps.Animation.BOUNCE);
          var eventObj = {};
          eventObj.place = place;
          eventObj.marker = marker;
          eventObj.index = index;          
          eventObj.eventType = "mouseover";
          eventObj.origin = "marker";
          self.handleListAndMarkerEvent(eventObj);
        });

        google.maps.event.addListener(marker, 'mouseout', function() {
          // marker.setAnimation(null);
          var eventObj = {};
          eventObj.place = place;
          eventObj.marker = marker;
          eventObj.index = index;
          eventObj.eventType = "mouseout";
          eventObj.origin = "marker";
          self.handleListAndMarkerEvent(eventObj);

        });

        google.maps.event.addListener(marker, 'click', function(event) {
          var eventObj = {};
          eventObj.place = place;
          eventObj.index = index;
          eventObj.marker = marker;
          eventObj.eventType = "click";
          eventObj.origin = "marker";          
          self.handleListAndMarkerEvent(eventObj);
        });

        bounds.extend(place.geometry.location);
        
      });
 
    app.model.mapLoaded(true);
    return true;
  }; 

  self.handleListAndMarkerEvent = function(obj) {

    var place, 
        index =  (typeof(obj.index) === "function") ? obj.index() : obj.index;
        marker = self.markers[index];

    if ( obj.origin === "list" ) {
      place = self.places[index];
    }
    else if ( obj.origin === "marker" ) {
      place = app.model.filteredPlaces[index];
      // $(".search-result-data-hover").eq(0).scrollIntoView(false);

      // marker = self.markers[obj.index];      
    }

    if (obj.eventType === "mouseover") {
      if (typeof(obj.place.itemCss) === "function") {
        obj.place.itemCss("search-result-data-hover");
        // ko.mapping.fromJS(self.places, app.model.googlePlaces);      

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
        obj.place.vicinity +
        '</div></div></div>';

      self.infowindow.setContent(infoContent);          
      self.infowindow.open(self.map, marker);

      // $(".search-result-data-hover").eq(0).length && $(".search-result-data-hover").eq(0).scrollIntoView(false);
      $(".search-result-data-hover").eq(0).length && $(".search-result-data-hover").eq(0).focus();



    }

    else if (obj.eventType === "mouseout") {
      if (typeof(obj.place.itemCss) === "function") {
        obj.place.itemCss("");
      }
      if (typeof(obj.place.itemCss) === "string") {      
        obj.place.itemCss = "";
        ko.mapping.fromJS(self.places, app.model.googlePlaces);      
      }    
      self.infowindow.close(self.map, marker);
    }

    else if (obj.eventType === "click") {      
      self.infowindow.close(self.map, marker);          
      app.service.getLocInfo(obj.place,obj.eventType,"mapMarker");
      // $('#locInfoModal').modal('handleUpdate');
      $('#locInfoModal').modal('show');
    }
  };

})(this);