/**
 * Members view model
 */

var app = app || {};

app.Places = (function () {
    'use strict'
    var infoWindow, markers, place;
    /**
     * The CenterControl adds a control to the map that recenters the map on
     * current location.
     */
    function CenterControl(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '15px';
        controlUI.style.marginRight = '15px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.lineHeight = '20px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Restart';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function () {
            app.Places.locationViewModel.onNavigateHome();
        });
    }
    var placesViewModel = (function () {
        var map, geocoder,locality, home
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
            markers: [],
            hideSearch: false,
            locatedAtFormatted: function (marker) {
                var position = new google.maps.LatLng(marker.latitude, marker.longitude);
                marker.Mark = new google.maps.Marker({
                    map: map,
                    position: position,
                    icon: {
                    url: 'http://maps.gstatic.com/mapfiles/circle.png',
                    anchor: new google.maps.Point(10, 10),
                    scaledSize: new google.maps.Size(10, 17)
                }
                });
                return (marker.latitude+"/"+marker.longitude);
            },
            onNavigateHome: function () {
                var that = this,
                    position;
                that._isLoading = true;
                that.toggleLoading();
                markers = app.Places.locationViewModel.markers;
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
                app.Places.locationViewModel.markers = new Array;

                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        map.panTo(position);
                        that._putMarker(position);
                        home=position;
                        locality = position;

                        that._isLoading = false;
                        that.toggleLoading();
                    },
                    function (error) {
                        //default map coordinates
                        position = new google.maps.LatLng(0,0);
                        map.panTo(position);

                        that._isLoading = false;
                        that.toggleLoading();

                        app.notify.showShortTop("Unable to determine current location. Cannot connect to GPS satellite.");
                    },
                    {
                        timeout: 30000,
                        enableHighAccuracy: true
                    }
                );
            },
            clearMap: // Deletes all markers in the array by removing references to them.
                function deleteMarkers() {
                    setMapOnAll(null);
                    markers = [];
                    app.Places.locationViewModel.markers = new Array;
                },
            onPlaceSearch: function () {
                // Create the PlaceService and send the request.
                // Handle the callback with an anonymous function.
                var service = new google.maps.places.PlacesService(map);
                
                // Specify location, radius and place types for your Places API search.
                var request = {
                    location: locality,
                    bounds: map.getBounds(),
                    keyword: ['cafe', 'restaurant']
                };

                
                service.radarSearch(request, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        map.panTo(results[0].geometry.location);
                        for (var i = 0; i < results.length; i++) {
                            place = results[i];
                            addMarker(place)
                        }
                    }
                });

                function addMarker(place) {
                    // If the request succeeds, draw the place location on
                    // the map as a marker, and register an event to handle a
                    // click on the marker.
                    var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                        icon: {
                            url: 'http://maps.gstatic.com/mapfiles/circle.png',
                            anchor: new google.maps.Point(10, 10),
                            scaledSize: new google.maps.Size(10, 17)
                        }
                    });

                    app.Places.locationViewModel.markers.push(marker);

                    google.maps.event.addListener(marker, 'click', function () {
                        service.getDetails(place, function (result, status) {
                            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                                console.error(status);
                                return;
                            }
                            if (result.reviews === undefined || result.reviews === undefined) {
                                infoWindow.setContent('<div><strong>' + '<a id="addButton" class="nav-button" data-align="right" data-role="button" data-click="app.notify.openBrowser(\''+
                  result.website + ')\"><u>'+ result.name + '</u></a></strong><br>' +
                  'Phone: ' + result.formatted_phone_number + '<br>' +
                  result.formatted_address + '<br>No reviews or stars.</div>');
                            }
                            else {
                                infoWindow.setContent('<div><strong>' + '<a href=\'' +
              result.website + 'target=\'_blank\' \'location=yes,closebuttoncaption=Done\' >' + result.name + '</a></strong><br>' +
              'Phone: ' + result.formatted_phone_number + '<br>' +
              result.formatted_address + '<br>' + result.reviews[0].text.split(". ")[0] + '  ... ' + result.reviews.length + ' reviews and ' + result.rating + ' stars.</div>');
                            }
                            infoWindow.open(map, marker);
                        });
                    });
                };
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
                            app.notify.showShortTop("Unable to find that address.");
                            return;
                        }
                        
                        map.panTo(results[0].geometry.location);
                        //bounds
                        that._putMarker(results[0].geometry.location);
                        locality = results[0].geometry.location;
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
            places: placesDataSource,
            currentLocation:home
        });
        return {
            initLocation: function () {
                //common variables 
                if (typeof google === "undefined") {
                    return;
                }

                infoWindow = new google.maps.InfoWindow();

                var pos, userCords, streetView, tempPlaceHolder = [];

                var mapOptions = {
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    zoomControl: true,
                    zoomControlOptions: {
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                    },
                    mapTypeControl: false,
                    streetViewControl: false,
                    scroolwheel: false,
                    zoom: 14,
                    center: new google.maps.LatLng(0,0),
                    panCtrl: false,
                    zoomCtrl: true,
                    zoomCtrlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.RIGHT_CENTER
                    },
                    scaleControl: false
                }

                //Fire up
                app.Places.locationViewModel.set("isGoogleMapsInitialized", true);
                map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
                geocoder = new google.maps.Geocoder();
                app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);
                streetView = map.getStreetView();
                // Create the DIV to hold the control and call the CenterControl()
                // constructor passing in this DIV.
                var centerControlDiv = document.createElement('div');
                var centerControl = new CenterControl(centerControlDiv, map);
                centerControlDiv.index = 1;
                map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControlDiv);
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
