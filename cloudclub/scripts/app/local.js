/**
 * local view model
 */

var app = app || {};
'use strict'
app.Local = (function () {
    var locality;
    locality = new google.maps.LatLng(26.25, 80.10);

    var localViewModel = kendo.data.ObservableObject.extend({

        onNavigateLocal: function(){
            var map = new google.maps.Map(document.getElementById('map-local'), {
                center: locality,
                zoom: 15,
                scrollwheel: false
            });

            // Specify location, radius and place types for your Places API search.
            var request = {
                location: locality,
                radius: '500',
                types: ['all']
            };

            // Create the PlaceService and send the request.
            // Handle the callback with an anonymous function.
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
                        var place = results[i];
                        // If the request succeeds, draw the place location on
                        // the map as a marker, and register an event to handle a
                        // click on the marker.
                        var marker = new google.maps.Marker({
                            map: map,
                            position: place.geometry.location
                        });
                    }
                }
            });
        }})
    return{
        localViewModel: new localViewModel()}   
}());