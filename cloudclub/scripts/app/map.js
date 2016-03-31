/**
 * Comments view model
 */

var app = app || {};

app.Places = (function () {
    'use strict'

    var placesViewModel = (function () {
        var map,
        geocoder


        var LocationViewModel = kendo.data.ObservableObject.extend({
            _lastMarker: null,
            _isLoading: false,

            address: "",
            isGoogleMapsInitialized: false,
            hideSearch: false,

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
                        position = new google.maps.LatLng(43.459336, -80.462494);
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

            onSearchAddress: function () {
                var that = this;

                geocoder.geocode(
                    {
                        'address': that.get("address")
                    },
                    function (results, status) {
                        if (status !== google.maps.GeocoderStatus.OK) {
                            navigator.notification.alert("Unable to find address.",
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

        });


        var placeModel = {
            id: 'Id',
            fields: {
                Place: {
                    field: 'Place',
                    defaultValue: ''
                },
                CreatedAt: {
                    field: 'CreatedAt',
                    defaultValue: new Date()
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
            },
            sort: { field: 'CreatedAt', dir: 'desc' }
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
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },

                    mapTypeControl: false,
                    streetViewControl: false
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
            places: placesDataSource,
            locationViewModel: new LocationViewModel()
        };

    }());

    return placesViewModel;

}());
