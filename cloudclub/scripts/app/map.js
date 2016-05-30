/**
 * Members view model
 */

var app = app || {};

app.Places = (function () {
    'use strict'
    var infoWindow, markers, place, result, service, here, request, position, lat1, lng1, allBounds, near, theZoom = 12, service, allPartners,
		infoContent;
    //Location PopUp Html
    var HEAD = '<div class="iw-title"></div>'
        + '<div class="iw-content"><div class="iw-subTitle">%Name%</div>'
        + '<div><a data-role="button" class="butn" data-rel="external" href="tel:Phone">'
        + '<img src="styles/images/phone2.png" alt="phone" height="auto" width="15%"></a><small>'
        + 'Address, Open Stars</small></div>'
        + '<div ><br/>' + '<a data-role="button" class="butn" href="components/activities/view.html?partner=%Name%");"><img src="styles/images/icon.png" alt="On2See" height="auto" width="15%"></a>'
        + '<a data-role="button" class="butn" href="UrlString");"><img src="styles/images/thumb_up.png" alt="On2See" height="auto" width="15%"></a>'
        + '<a data-role="button" class="butn" href="components/activities/view.html?partner=%Name%");"><img src="styles/images/green-share.png" alt="On2See" height="auto" width="15%"></a>'
        + '<a data-role="button" class="butn" onclick="test(\'https://www.google.com/maps/place/Google\');"><img src="styles/images/googleMap.png" alt="Google" height="auto" width="15%"></a>'
        + '<a data-role="button" class="butn" data-rel="external" onclick="test(\'https://twitter.com/search?q=Twitter\');"><img src="styles/images/twitter.png" alt="Twitter" height="auto" width="15%"></a>'
        + '<a data-role="button" class="butn" data-rel="external" onclick="test(\'https://www.yelp.com/biz/Yelp\');"><img src="styles/images/yelp_64.png" alt="Yelp" height="auto" width="15%"></a>'
        + '<a data-role="button" class="butn" data-rel="external" onclick="test(\'https://www.facebook.com/Facebook\');"><img src="styles/images/facebook2.png" alt="Facebook" height="auto" width="15%"></a>'
        + '<a data-role="button" class="butn" data-rel="external" onclick="test(\'WebSite\')"><img src="Icon" alt="Logo" height="auto" width="15%"></a>'
        + '</div>';
    //+ '<div class="button-group button-group-horizontal">'
    //+ '<a data-role="button" class="butn" data-rel="external" onclick="test(\'https://www.groupon.com/browse?lat=26.44&lng=-80.07\');"><img src="styles/images/groupon.png" alt="groupon" height="auto" width="15%"></a><img src="styles/images/star3.png" alt="Star3" height="auto" width="15%"></div>';
    //+ '<div class="iw-bottom-gradient"></div>';
    //<table ${visibility} style="width:100%; margin-top:15px"><tr style="width:100%"><td style="width:50%"><a data-role="button" class="btn-continue km-widget km-button" href="components/activities/view.html?partner=Name">See the Details</a></td></tr></table>
    /**
     * The Google Map CenterControl adds a control to the map that recenters the map on
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
        controlUI.style.marginTop = '10px';
        controlUI.style.marginRight = '10px';
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
        controlText.innerHTML = 'List';
        controlUI.appendChild(controlText);


        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function () {
            //app.Places.locationViewModel.onNavigateHome();
            app.mobileApp.navigate('views/listView.html');
        });
    }
    //Places Model loads the known places 
    //TO DO: Filter by 70 mile region and refresh when locatio changes
    var placesViewModel = (function () {
        var map, geocoder, locality, home
        var placeModel = {
            fields: {
                name: {
                    field: 'Place',
                    defaultValue: ''
                },
                url: {
                    field: 'Website',
                    defaultValue: 'www.google.com?search=\' + result.name'
                },
                icon: {
                    field: 'Icon',
                    defaultValue: 'styles/images/avatar.png'
                },
                marker: {
                    field: 'Location',
                    defaultValue: []
                },
                text: {
                    field: 'Description',
                    defaultValue: 'Empty'
                },
                html: {
                    field: 'Html',
                    defaultValue: ''
                },
                address: {
                    field: 'Address',
                    defaultValue: ''
                },
                phone: {
                    field: 'Phone',
                    defaultValue: ''
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
        var viewModelSearch = kendo.observable({
            selectedProduct: null,
            products: appSettings.products
        });
        //viewModelSearch.selectedProduct = viewModelSearch.products[7];
        //kendo.bind($("#searchList"), app.Places.locationViewModel.viewModelSearch);
        var resolveString = function (name, find, replace) {
            var length = name.split(find).length - 1;
            var theString;
            theString = name;
            for (var i = 0; i < length; i++) {
                theString = theString.replace(find, replace);
            }
            return theString;
        };
        var LocationViewModel = kendo.data.ObservableObject.extend({
            _lastMarker: null,
            _isLoading: false,
            address: "",
            find: null,
            isGoogleMapsInitialized: false,
            markers: [],
            details: [],
            hideSearch: false,
            products: viewModelSearch.products,
            selectedProduct: viewModelSearch.selectedProduct,
            locatedAtFormatted: function (marker, text, html, address, name, url, phone, icon) {
                // test for geopoint as a string and convert string to geopoint
                if (marker.length != undefined) {
                    if (marker.length > 15) {
                        var lat = parseFloat(marker.split(',')[0].split(':')[1].trim());
                        var lng = parseFloat(marker.split(',')[1].split(':')[1].trim());
                        marker = {
                            latitude: lat,
                            longitude: lng
                        };
                    }
                }
                marker.lat = marker.latitude;
                marker.lng = marker.longitude;
                var place = {
                    details: {
                        website: url,
                        formatted_phone_number: phone,
                        formatted_address: address,
                    },
                    geometry: {
                        location: marker
                    },
                    address: address,
                    name: name,
                    url: url,
                    phone: phone,
                    avatar: icon,
                    html: html,
                    text: text,
                    location: marker,
                    starString: "",
                    distanceString: "",
                    addurl: "components/activities/view.html?partner=%Name%"
                }
                //place = app.Places.locationViewModel.updatePlace(place)
                place.distance = app.Places.locationViewModel.updateDistance(place.geometry.location.lat, place.geometry.location.lng)
                place = app.Places.locationViewModel.updateStars(place);
                //Add review count, Stars and Distance
                if (marker) {
                    var htmlString = app.Places.locationViewModel.getButtons(place);
                    htmlString = htmlString.replace('UrlString', place.addurl);
                    var filter = {};
                    var params = [];
                    filter.params = params;
                    var field = "name";
                    var operator = "contains";
                    var value = name;
                    var param = {
                        "field": field,
                        "operator": operator,
                        "value": value
                    };
                    filter.params.push(param);
                    var js = JSON.stringify(filter);
                    htmlString = htmlString.replace('Filter', js).replace('undefined','');
                    var position = new google.maps.LatLng(marker.latitude, marker.longitude);
                    place.markerUrl = 'styles/images/icon.png'
                    try {
                        //app.Places.locationViewModel.addMarker(place);
                        marker.Mark = new google.maps.Marker({
                            map: map,
                            position: position,
                            icon: {
                                url: place.markerUrl,
                                anchor: new google.maps.Point(20, 38),
                                scaledSize: new google.maps.Size(40, 40),
                                title: viewModelSearch.selectedProduct
                            }
                        });
                        google.maps.event.addListener(marker.Mark, 'click', function () {
                            if (html === '' || html === undefined) {
                                infoWindow.setContent(text);
                            } else {
                                //htmlString = app.Places.locationViewModel.getButtons(place);
                                infoWindow.setContent(htmlString);
                            }
                            infoWindow.open(map, marker.Mark);
                        });

                    } catch (e) {
                        app.showAlert("Error " + JSON.stringify(e));
                    }
                }
                return;
            },
            updateDistance: function (lat2, lng2) {
                        var R = 6371; // km
                        var dLat = (lat2 - lat1) * Math.PI / 180;
                        var dLon = (lng2 - lng1) * Math.PI / 180;
                        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2);
                        var c = 2 * Math.asin(Math.sqrt(a));
                        var d = R * c / 1.61; // converted to miles
                        return d.toFixed(2);
                              
            },
            updateStars: function (place) {
                if (app.isNullOrEmpty(place.rating)) {
                    place.rating = "??";
                }
                place.isSelected = false;
                place.isSelectedClass = "";
                place.visibility = "hidden";
                if (app.isNullOrEmpty(place.price_level)) {
                    place.price_level = 0;
                }
                place.priceString = '$$$$$$$'.substring(0, place.price_level);
                return place;
            },
            onNavigateHome: function () {
                //find present location, clear markers and set up members as icons
                var that = this,
					position;
                that._isLoading = true;
                that.toggleLoading();
                if (!app.Places.locationViewModel.markers) { app.Places.locationViewModel.markers = new Array; }
                if (!app.Places.locationViewModel.details) { app.Places.locationViewModel.details = new Array; }
                markers = app.Places.locationViewModel.markers;
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
                app.Places.locationViewModel.markers = new Array;
                app.Places.locationViewModel.details = new Array;
                navigator.geolocation.getCurrentPosition(
					function (position) {
					    home = position;
					    position = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					    map.panTo(position);
					    //that._putMarker(position); //TO DO: hide or show present location marker
					    locality = position;
					    lat1 = position.lat();
					    lng1 = position.lng();
					    that._isLoading = false;
					    that.toggleLoading();
					    var partners = app.everlive.data('Places');
					    partners.get().then(function (data) {
					        allPartners = data.result;
					        for (var i = 0; i < data.count; i++) {
					            var partner = allPartners[i];
					            app.Places.locationViewModel.locatedAtFormatted(partner.Location, partner.Description, partner.Html, partner.Address, partner.Place, partner.Website, partner.Phone, partner.Icon);
					        }
					    },
                        function (error) {
                            app.showAlert(JSON.stringify(error))
                        });
					
					},
					function (error) {
					    //default map coordinates
					    position = new google.maps.LatLng(0, -20);
					    map.panTo(position);

					    that._isLoading = false;
					    that.toggleLoading();

					    //app.notify.showShortTop("Map.Unable to determine current location. Cannot connect to GPS satellite.");
					}, {
					    timeout: 30000,
					    enableHighAccuracy: true
					}
				);
            },
            clearMap: // Deletes all markers in the array by removing references to them.
				function deleteMarkers() {
				    markers = app.Places.locationViewModel.markers;
				    for (var i = 0; i < markers.length; i++) {
				        markers[i].setMap(null);
				    }

				    markers = [];
				    app.Places.locationViewModel.markers = new Array;
				    app.Places.locationViewModel.details = new Array;
				    //if (document.getElementById("place-list-view") !== null && document.getElementById("place-list-view").innerHTML !== null) {
				    //    document.getElementById("place-list-view").innerHTML = "<strong> Cleared</strong>";
				    //}
				},
            onPlaceSearch: function (markers) {
                markers = app.Places.locationViewModel.markers;
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
                app.Places.locationViewModel.markers = new Array;
                app.Places.locationViewModel.details = new Array;
                // Create the PlaceService and send the request.
                // Handle the callback with an anonymous function.
                service = new google.maps.places.PlacesService(map);
                here = map.getBounds();
                // Specify location, radius and place types for your Places API search.
                request = {
                    location: locality,
                    bounds: here,
                    keyword: app.Places.locationViewModel.find
                };
                service.nearbySearch(request, function (results, status) {
                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                        //if length = 0 offer search by country or search by region
                        map.panTo(results[0].geometry.location);
                        for (var i = 0; i < results.length; i++) {
                            place = results[i];
                            place.distance = app.Places.locationViewModel.updateDistance(place.geometry.location.lat(), place.geometry.location.lng());
                            place = app.Places.locationViewModel.updateStars(place);
                            app.Places.locationViewModel.addMarker(place);
                            app.Places.locationViewModel.details.push(place);
                        }
                    } else {
                        // Do Place search
                        app.notify.showShortTop("Nothing was found in the area shown.");
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
            addMarker: function (place) {
                    // If the request succeeds, draw the place location on the map as a marker, and register an event to handle a click on the marker.
                    if (!place.markerUrl) {
                        place.markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/greencircle.png'; //'http://maps.gstatic.com/mapfiles/circle.png';
                        if (place.rating < 3.5) place.markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/redcircle.png';
                        if (place.rating > 4.2) place.markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/orangecircle.png';
                    }

                    var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                        icon: {
                            url: place.markerUrl,
                            anchor: new google.maps.Point(3 * place.rating, 5 * place.rating),
                            scaledSize: new google.maps.Size(4 * place.rating, 4 * place.rating)
                        }
                    });


                    app.Places.locationViewModel.markers.push(marker);
                    //extend the bounds to include each marker's position
                    allBounds.extend(marker.position);
                    //now fit the map to the newly inclusive bounds
                    map.fitBounds(allBounds);

                    google.maps.event.addListener(marker, 'click', function () {
                        service.getDetails(place, function (result, status) {
                            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                                console.error(status);
                                return;
                            }
                            place.details = result;
                            place.openString = "Closed, ";
                            if (place.opening_hours) {
                                if (place.opening_hours.open_now) {
                                    place.openString = result.formatted_phone_number + '<strong> Open Now</strong>';
                                }
                            }
                            place.starString = '<br>No reviews or stars. ';
                            if (result.reviews === undefined || result.stars === undefined) {
                                place.starString = '... <strong>' + result.reviews.length + '</strong> reviews and <strong>' + result.rating + '</strong> stars, about <strong>' + place.distance + '</strong> miles (ATCF). <br/>' + place.priceString + '</small>';
                            }
                            if (!place.name) { place.name = "Unknown Name"; }
                            if (place.text) { place.text = resolveString(place.text, "&", "and"); }
                            else { place.text = "Not Available" };
                            place.addurl = encodeURI('components/partners/add.html?Name=' + place.name
                                + '&email=newpartner@on2t.com'
                                + '&longitude=' + place.geometry.location.lng()
                                + '&latitude=' + place.geometry.location.lat()
                                + '&html=hhhhh'
                                + '&icon=styles/images/avatar.png'
                                + '&address=' + result.formatted_address.replace('#', '')
                                + '&textField=' + resolveString(result.reviews[0].text, '\'', '')
                                + '&www=' + result.website
                                + '&tel=' + result.formatted_phone_number
                                + '&placeId=' + place.place_id);
                            //    place.infoContent = '<div><span onclick="test(\'' + result.website + '\')\"><strong><u>' + result.name + '</u></a></strong><br>' + 'Phone: ' + result.formatted_phone_number + '<br>' + result.formatted_address.replace('#', '') + place.starString  + place.openString + '</span></div>'
                            //       + '<div><table ${visibility} style="width:100%; margin-top:15px"><tr style="width:100%"><td style="width:33%"><a data-role="button" href='
                            //       + url
                            place.avatar = "styles/images/avatar.png";
                            place.infoContent = app.Places.locationViewModel.getButtons(place);
                            //       + ' class="btn-login km-widget km-button">Endorse this Place</a></td></tr></table></div>';
                            //}
                            infoWindow.setContent(place.infoContent);
                            //.Places.locationViewModel.getButtons(result.website, "styles/images/avatar.png", result.formatted_phone_number, place.name, result.formatted_address.replace('#', '')));
                            infoWindow.open(map, marker);
                        });
                    });
                },
            onSearchAddress: function () {
                var that = this;

                geocoder.geocode({
                    'address': that.get("map-address")
                },
					function (results, status) {
					    if (status !== google.maps.GeocoderStatus.OK) {
					        app.notify.showShortTop("Map.Unable to find anything.");
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
            getButtons: function (place) {//url,icon,phone,name,address) {
                var Stars = 3;
                var htmlString = HEAD;
                htmlString = htmlString.replace('WebSite', place.details.website).replace('Icon', place.avatar).replace('Phone', place.details.formatted_phone_number).replace('%Name%', place.name).replace('%Name%', place.name).replace('%Name%', place.name).replace("Address", place.details.formatted_address);
                htmlString = htmlString.replace('Phone', place.details.formatted_phone_number).replace('%Name%', place.name).replace('Open', place.openString).replace('Stars', place.starString);
                htmlString = htmlString.replace('UrlString', place.addurl);
                var stringResult, find, replace;
                //Twitter Change//https://twitter.com/search?q=Nick%27s%20Pizza%20Deerfield%20Beach&src=typd&lang=en
                find = '\'';
                replace = '%27';
                stringResult = resolveString(place.name, find, replace);
                find = ' '; // space change
                replace = '%20';
                htmlString = htmlString.replace('Twitter', resolveString(stringResult, find, replace));
                //Rest
                find = '\'';
                replace = '';//Remove (reused in part)
                stringResult = resolveString(place.name, find, replace);
                //Facebook//https://www.facebook.com/thewhalesribrawbar/?fref=ts
                find = ' '; // space change same remove replace
                replace = '-';
                htmlString = htmlString.replace('Facebook', resolveString(stringResult, find, replace));
                //Google//https://www.google.com/maps/place/Bocas+Best+Pizza+Bar
                replace = '+';
                htmlString = htmlString.replace('Google', resolveString(stringResult, find, replace));
                //Yelp//http://www.yelp.com/biz/bocas-best-pizza-bar-boca-raton
                replace = '-';
                var city = "-" + place.details.formatted_address.split(',')[(place.details.formatted_address.split(',').length - 2)].trim().replace(' ', '-');
                if (city.split('-')[3] === undefined) city = "-" + place.details.formatted_address.split(',')[(place.details.formatted_address.split(',').length - 3)].trim().replace(' ', '-');
                htmlString = htmlString.replace('Yelp', resolveString(stringResult, find, replace) + city);
                //https://www.youtube.com/watch?v=oO4IZaujgrM;
                return htmlString;
            },
        });
        return {
            initLocation: function () {
                //common variables 
                if (typeof google === "undefined") {
                    return;
                }

                infoWindow = new google.maps.InfoWindow();
                //create empty LatLngBounds object
                allBounds = new google.maps.LatLngBounds();

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
                    zoom: theZoom,
                    center: new google.maps.LatLng(0, -20), // only blue sea
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
                //                service = new google.maps.places.PlacesService(map);

                var directionsService = new google.maps.DirectionsService;
                var directionsDisplay = new google.maps.DirectionsRenderer;
                directionsDisplay.setMap(map);
                var origin_input = document.getElementById('origin-input');
                var destination_input = document.getElementById('destination-input');
                var modes = document.getElementById('mode-selector');

                //map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);

                geocoder = new google.maps.Geocoder();
                app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);
                streetView = map.getStreetView();
            },
            show: function () {
                //navigator.geolocation.getCurrentPosition(function (position) {
                //    position = position;
                //}, function (error) {
                //    app.notify.showShortTop('code: ' + error.code + '<br/>' +
				//		 'message: ' + error.message + '<br/>');
                //}, {
                //    enableHighAccuracy: true,
                //    timeout: 10000
                //});
                if (app.isNullOrEmpty(app.Places.locationViewModel) || !app.Places.locationViewModel.get("isGoogleMapsInitialized")) {
                    app.Places.locationViewModel = new LocationViewModel();
                    //TO DO: Clean up map locations
                    app.notify.showShortTop("Map reload!");
                    return;
                }
                //resize the map in case the orientation has been changed while showing other tab
                google.maps.event.trigger(map, "resize");
            },
            hide: function () {
                //hide loading mask if user changed the tab as it is only relevant to location tab
                kendo.mobile.application.hideLoading();
            },
            locationViewModel: new LocationViewModel(),
            listShow: function () {
                //var price = '$$$$$'.substring(1, app.Places.locationViewModel.details.price_level);
                $("#places-listview").kendoMobileListView({
                    dataSource: app.Places.locationViewModel.details,
                    template: "<div class='${isSelectedClass}'>#: name #<br /> #: vicinity # -- #: distance # m, #: rating # Stars, #: priceString # <table ${visibility} style='width:100%; margin-top:15px'><tr style='width:100%'><td style='width:33%'><a data-role='button' data-bind='click: memorize' class='btn-register'>Endorse</a></td><td style='width:33%'><a data-role='button' data-click='memorize' class='btn-login km-widget km-button'>Memorize</a></td><td style='width:33%'><a data-role='button' href='views/activitiesView.html' class='btn-continue km-widget km-button'>Comment</a></td></tr></table><br /></div>"
                });
            },
            onSelected: function (e) {
                if (!e.dataItem) {
                    return;
                }
                var isSelected = e.dataItem.get("isSelected");
                var newState = isSelected ? false : true;
                e.dataItem.set("isSelected", newState);
                if (newState === true) {
                    e.dataItem.set("isSelectedClass", "listview-selected");
                    e.dataItem.set("visibility", "visible")
                } else {
                    e.dataItem.set("isSelectedClass", "");
                    e.dataItem.set("visibility", "hidden")
                }
            },
            memorize: function () {
                app.notify.memorize();
            },
            near: function (callBack) {
                app.notify.getLocation(function (x) { callBack(x) });
            }
        };
    }());
    return placesViewModel;
}());