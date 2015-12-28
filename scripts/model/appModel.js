var app = app || {};

app.Model = function() {
    var self = this;
    this.ready = function(callback) {
        ko.applyBindings(this);
        callback();
    };

    this.currentItem = ko.observableArray();
    this.searchString = ko.observable("");
    this.geoPresent = ko.observable("");
    this.googlePlaces = ko.mapping.fromJS(app.maps.places);
    this.modalContent = { 
        wiki: ko.observable(""), 
        // yelp: ko.observableArray()
        yelp: {
            loaded: ko.observable(false),
            image: ko.observable(""),
            address: ko.observable(""),
            ratingImg: ko.observable(""),
            url: ko.observable(""),
            totalReviews: ko.observable(""),
            snippetImg: ko.observable(""),
            snippetTxt: ko.observable(""),
            fallback: ko.observable(""),
            resultsCount: ko.observable(""),
            error: ko.observable(false)

        }
    };
    this.mapLoaded = ko.observable(false);
    this.modalHeader = { title: ko.observable(""), icon: ko.observable("")};
    this.resultsLen = ko.observable("");
    this.resultHover = ko.observable(false);
    // this.getSearchResultClass = ko.observable(false);
    this.getPlaceInfo = function(data, event) { 
        app.service.getLocInfo(data,event, "app");
    };
    this.updateModel = function(node, data) {
            node = node || {};
            node = data;
        
    };

    this.assignSearchResultsClass = function() {

        this.googlePlaces().forEach(function(place){
            place.itemCss = ko.observable("");
        });

        this.filteredPlaces().forEach(function(place){
            place.itemCss = ko.observable("");
        });
    };


    this.handleResultHover = function(data, event, index) {

        var eventObj = {};
        eventObj.place = app.maps.places[index()];
        eventObj.marker = app.maps.markers[index()];
        eventObj.index = index;
        eventObj.eventType = event.type;
        eventObj.origin = "list";        
        app.maps.handleListAndMarkerEvent(eventObj);


    };

    this.setCurrentPos = function(data,event) {
        app.maps.map.setCenter(app.maps.geo);
    };

    this.getPanelClass =  ko.pureComputed(function() {
        return (this.resultsLen()) ? "side-panel-expand" : "side-panel-collapse";
    },this);

    this.getFilterClass =  ko.pureComputed(function() {
        return (this.resultsLen()) ? "filter-visible" : "filter-hidden";
    },this);

    this.getSearchResultClass = ko.pureComputed(function(data) {
        return data.itemCss;
    },this);


    self.filteredInput = ko.observable(false);

    self.filterPlaceString = ko.observable('');

    self.filteredPlaces = ko.computed(function () {


        if (self.googlePlaces()) {

            var out = ko.utils.arrayFilter(self.googlePlaces(), function (place) {            
                return (
                          (self.filterPlaceString().length == 0 || place.name().toLowerCase().indexOf(self.filterPlaceString().toLowerCase()) > -1)
                       )        
            });    

            if (self.filteredInput()) {
                app.maps.renderMap(ko.toJS(out), true);  
            }
            
            return out;          

        }
      
    });

   
};




    
