/**
 * Members view model
 */

var app = app || {};

app.Places = (function () {
    'use strict'
    var placesViewModel = (function () {
        var map, geocoder
        var placeModel = {
            fields: {
                place: {
                    field: 'Place',
                    defaultValue: ''
                },
                url: {
                    field: 'Website',
                    defaultValue: 'www.on2t.com'
                },
                marker: {
                    field: 'Location',
                    defaultValue: []
                },
                text: {
                    field: 'Description',
                    defaultValue: 'Empty'
                }
            }
        };
        var placesDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: placeModel
            },
            transport: {
                typeName: 'Places'
            }
        });
        var LocationViewModel = kendo.data.ObservableObject.extend({
            _lastMarker: null,
            _isLoading: false,
            address: "",
            isGoogleMapsInitialized: false,
            hideSearch: false,
            locatedAtFormatted: function (marker) {
                var position = new google.maps.LatLng(marker.latitude, marker.longitude);
                marker.Mark = new google.maps.Marker({
                    map: map,
                    position: position
                });
                return (marker.latitude+"/"+marker.longitude);
            },
            onNavigateHome: function () {
                var that = this,
                    position;

                that._isLoading = true;
                that.toggleLoading();

                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        map.panTo(position);
                        that._putMarker(position);

                        that._isLoading = false;
                        that.toggleLoading();
                    },
                    function (error) {
                        //default map coordinates
                        position = new google.maps.LatLng(0,0);
                        map.panTo(position);

                        that._isLoading = false;
                        that.toggleLoading();

                        navigator.notification.alert("Unable to determine current location. Cannot connect to GPS satellite.",
                            function () { }, "Location failed", 'OK');
                    },
                    {
                        timeout: 30000,
                        enableHighAccuracy: true
                    }
                );
            },
            onPlaceSearch: function () {
                var locality;
                locality = new google.maps.LatLng(-33.8665, 151.1956);
                // Specify location, radius and place types for your Places API search.
                var request = {
                    location: locality,
                    radius: '500',
                    types: ['store']
                };

                // Create the PlaceService and send the request.
                // Handle the callback with an anonymous function.
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        map.panTo(results[0].geometry.location);
                        for (var i = 0; i < results.length; i++) {
                            var place = results[i];

                            // If the request succeeds, draw the place location on
                            // the map as a marker, and register an event to handle a
                            // click on the marker.
                            var marker = new google.maps.Marker({
                                map: map,
                                position: place.geometry.location
                            });
                            marker.addListener('click', toggleBounce);
                        }
                    }
                });
                function toggleBounce() {
                    if (this.getAnimation() !== null) {
                        this.setAnimation(null);
                    } else {
                        this.setAnimation(google.maps.Animation.BOUNCE);
                    }
                };
            },
            onSearchAddress: function () {
                var that = this;

                geocoder.geocode(
                    {
                        'address': that.get("address")
                    },
                    function (results, status) {
                        if (status !== google.maps.GeocoderStatus.OK) {
                            app.notify.showShortTop("Unable to find that address.",
                                function () { }, "Search failed", 'OK');

                            return;
                        }

                        map.panTo(results[0].geometry.location);
                        that._putMarker(results[0].geometry.location);
                    });
            },
            toggleLoading: function () {
                if (this._isLoading) {
                    kendo.mobile.application.showLoading();
                } else {
                    kendo.mobile.application.hideLoading();
                }
            },
            _putMarker: function (position) {
                var that = this;

                if (that._lastMarker !== null && that._lastMarker !== undefined) {
                    that._lastMarker.setMap(null);
                }

                that._lastMarker = new google.maps.Marker({
                    map: map,
                    position: position
                });
            },
            places: placesDataSource
        });
        return {
            initLocation: function () {
                var mapOptions,
                    streetView;

                if (typeof google === "undefined") {
                    return;
                }

                app.Places.locationViewModel.set("isGoogleMapsInitialized", true);

                mapOptions = {
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },

                    mapTypeControl: false,
                    streetViewControl: false,
                    scroolwheel: false
                };

                map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                geocoder = new google.maps.Geocoder();
                app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);

                streetView = map.getStreetView();

                google.maps.event.addListener(streetView, 'visible_changed', function () {

                    if (streetView.getVisible()) {
                        app.Places.locationViewModel.set("hideSearch", true);
                    } else {
                        app.Places.locationViewModel.set("hideSearch", false);
                    }

                });
            },
            show: function () {
                if (!app.Places.locationViewModel.get("isGoogleMapsInitialized")) {
                    return;
                }

                //resize the map in case the orientation has been changed while showing other tab
                google.maps.event.trigger(map, "resize");
            },
            hide: function () {
                //hide loading mask if user changed the tab as it is only relevant to location tab
                kendo.mobile.application.hideLoading();
            },
            locationViewModel: new LocationViewModel()
        };
    }());
    return placesViewModel;
}());