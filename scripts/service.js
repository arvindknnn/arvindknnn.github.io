var app = app || {};
	app.service = app.service || {}; 	
	app.service.locationData = {};
	app.service.locationHeader = {};
	app.service.getLocInfo = function (data, event, source) {
		app.model.modalHeader.title(data.name);
		app.model.modalHeader.icon(data.icon);
		// app.service.locationData = app.service.locationData || {};
		var currentData = {};
		currentData.searchString = (typeof(data.name) == "function")? data.name() : data.name;
		// currentData.vicinity =   (typeof(data.formatted_address) == "function")? data.formatted_address() : data.formatted_address;
		currentData.vicinity =   (typeof(data.vicinity) == "function")? data.vicinity() : data.vicinity;

		currentData.itemId = (typeof(data.id) == "function")? data.id() : data.id;
		currentData.itemIcon = (typeof(data.icon) == "function")? data.icon() : data.icon;
		currentData.currentElement = $(event.currentTarget);
		currentData.getWiki = getWiki;
		currentData.getYelp = getYelp;


		// if(source === "app" || source === "mapMarker")	{
			if(app.model.currentItem().length && currentData.itemId === app.model.currentItem()[0].id) {
				console.log("No change");
			}
			else{
				$('#locInfoModal').modal('handleUpdate');
				app.model.currentItem().pop();
				app.model.currentItem().push(currentData);
				// app.model.modalContent.yelp.loading(true);
				// app.model.updateModel("this.currentItem", currentData);
				app.model.currentItem()[0].getWiki();
				app.model.currentItem()[0].getYelp();

			}
		};	

		function getWiki() {
			var ajaxUrl = 'https://en.wikipedia.org/w/api.php?format=json&action=query&callback=?';  					
			var askWho = "Wikipedia"; 					
			var	searchString = this.searchString;
			var ajaxData = { titles: searchString, prop: "extracts"};

			$.jsonp({
				url: ajaxUrl,
				data: ajaxData,
				dataType: 'jsonp',
				callback: 'callback',
				success: function(resp) {
					app.model.modalContent.yelp.loaded(true);
					app.service.locationData.wiki = resp.query.pages[Object.keys(resp.query.pages)[0]].extract;
					if(!app.service.locationData.wiki){
						app.service.locationData.wiki = "No information found on Wikipedia for " + searchString;										
					}
					app.model.modalContent.wiki(app.service.locationData.wiki);
				},
				error: function(d, e) {
					console.log("ajax call to " + askWho + " failed" );

				}

			});

		}

		function getYelp() {
  		var searchString = this.searchString;
  		var vicinity = this.vicinity;


  		var cb = function() {
  			console.log("called back");
  		}	

		var httpMethod = 'GET',
		    url = 'http://api.yelp.com/v2/search',
		    parameters = {
		        oauth_consumer_key : 'VNnj22sOA8uPhB41HtkEkg',
		        oauth_token : 'G40PQ2WD-4pHw1R2A9YyRKjQNU2xWBYq',
		        oauth_nonce : Math.floor(Math.random() * 1e9).toString(),
		        oauth_timestamp :  Math.floor((new Date).getTime() / 1e3),
		        oauth_signature_method : 'HMAC-SHA1',
		        oauth_version : '1.0',
		        term: searchString,
		        location: vicinity,				        
		        limit: 1,
		        callback: 'cb'
		    },
		    consumerSecret = 'X2M25H2aaA5fWPOx3ahXedpfPpo',
		    tokenSecret = '5jpAR6jypCB0y83aUBlKPpapNkg',
		    // generates a RFC 3986 encoded, BASE64 encoded HMAC-SHA1 hash
		    encodedSignature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret);
		    // generates a BASE64 encode HMAC-SHA1 hash
		    // signature = oauthSignature.generate(httpMethod, url, parameters, consumerSecret, tokenSecret,
		    //     { encodeSignature: false});
		    parameters.oauth_signature = encodedSignature;
		
		    $.jsonp({
		      	url: url,
		    	type: "GET",
		    	cache: true,
		    	data: parameters,
		    	dataType: 'jsonp',
		    	callback: 'cb',
		      	"success": function(yelpResponse) {
		          	if(yelpResponse.businesses.length){
			
					app.model.modalContent.yelp.error(false);


					// console.log(yelpResponse);

					app.model.modalContent.yelp.image(yelpResponse.businesses[0].image_url);

					app.model.modalContent.yelp.address("<address>" + 
						yelpResponse.businesses[0].location.address[0] + "<br>" + 					
						yelpResponse.businesses[0].location.city + "  " + 
						yelpResponse.businesses[0].location.state_code + "<br>" + 
						yelpResponse.businesses[0].location.postal_code + "<br>" + 
						yelpResponse.businesses[0].location.country_code + "<br> </address>");

					app.model.modalContent.yelp.ratingImg(yelpResponse.businesses[0].rating_img_url);
					app.model.modalContent.yelp.url(yelpResponse.businesses[0].url);
					app.model.modalContent.yelp.totalReviews(yelpResponse.businesses[0].review_count + " reviews");
					app.model.modalContent.yelp.snippetImg(yelpResponse.businesses[0].snippet_image_url);
					app.model.modalContent.yelp.snippetTxt(yelpResponse.businesses[0].snippet_text);
					app.model.modalContent.yelp.resultsCount(yelpResponse.businesses.length);

					}
					else {
						app.model.modalContent.yelp.error(true);
						app.model.modalContent.yelp.fallback("No information found on Yelp for " + searchString);
					}
		      	},
		      	"error": function(d,failResponse) {
					if(failResponse.id === "UNAVAILABLE_FOR_LOCATION") {
						app.model.modalContent.yelp.error(true);
						app.model.modalContent.yelp.fallback("No information found on Yelp for " + searchString);
					}
					else {
						app.model.modalContent.yelp.error(true);
						app.model.modalContent.yelp.fallback("Huh! Something went wrong while searching Yelp for " + searchString);
					}				      		
		          
		      	}
		    });
		}	
