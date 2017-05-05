# NeighborhoodSearch - Provides you "Near by" places on Google Maps based on your location

Prerequisites -

Requires HTTP Server

	Using python http server:

		python version < 3.0: python -m SimpleHttpServer 8080

		python version > 3.0: python -m http.server 8080

	Alternately, use other webservers such as tomcat



Requires browser to share location for the url

	Read about location sharing on Google Chrome Support page: https://support.google.com/chrome/answer/142065?hl=en


Usage -

App automatically displays businesses, parks, schools etc in your neighborhood. The places are displayed on google map and also as list. 

If location sharing is allowed, the app displays information based on the browser's location. If not, information pertaining to businesses in downtown San Francisco is displayed as default

Use the "Filter" input to filter the displayed places by character / word matching

Hover on items in the list to see basic information pop up on the map on its corresponding marker. 

Hover on a marker on the map to see the same information, which also highlights the corresponding list item.

Click on an list item or map marker to view detailed information. A pop up modal dialog with information from Yelp and Wikipedia pops up showing informaiton on the place, if available.


