/**
 * Members view model
 */

var app = app || {};

app.Places = (function () {
	'use strict'
	var infoWindow, markers, place, result, service, here, request, lat1, lng1, allBounds, near, theZoom = 12,
		infoContent;
	var HEAD = '<div class="iw-title"></div><div class="iw-content"><div class="iw-subTitle" onclick="test(\'WebSite\')"><u>Name</u></div><img src="Icon" alt="Logo" height="80" width="80"><p>Text</p><div class="iw-subTitle"><small><a href="tel:+Phone">Click to Call (+Phone)</a></small></div></div><table ${visibility} style="width:100%; margin-top:15px"><tr style="width:100%"><td style="width:50%"><a data-role="button" class="btn-continue km-widget km-button" href="components/activities/view.html?partner=Name">See the Details</a></td></tr></table><div class="iw-bottom-gradient"></div>';
    //https://www.google.com/maps/place/Bocas+Best+Pizza+Bar
    //http://www.yelp.com/biz/bocas-best-pizza-bar-boca-raton
    //https://www.facebook.com/thewhalesribrawbar/?fref=ts
    //https://twitter.com/search?q=Nick%27s%20Pizza%20Deerfield%20Beach&src=typd&lang=en
    //https://www.youtube.com/watch?v=oO4IZaujgrM

	//
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
					defaultValue: ''
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
		viewModelSearch.selectedProduct = viewModelSearch.products[7];
		//kendo.bind($("#searchList"), app.Places.locationViewModel.viewModelSearch);
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
			    // test for geopoint and convert
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
				if (marker) {
					var htmlString = HEAD.replace('text', text).replace('WebSite', html).replace('Icon', icon).replace('Text', text).replace('Phone', phone).replace('Name', name).replace('Address', address);
					htmlString = htmlString.replace('Phone', phone).replace('Name', name);
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
					htmlString = htmlString.replace('Filter', js);
					var position = new google.maps.LatLng(marker.latitude, marker.longitude);
				    try {
					marker.Mark = new google.maps.Marker({
						map: map,
						position: position,
						icon: {
							url: 'styles/images/icon.png',
							anchor: new google.maps.Point(20, 38),
							scaledSize: new google.maps.Size(40, 40),
							title: viewModelSearch.selectedProduct
						}
						//TO DO: add popup

					});
					google.maps.event.addListener(marker.Mark, 'click', function () {
						if (html === '' || html === undefined) {
							infoWindow.setContent(text);
						} else {
							infoWindow.setContent(htmlString);
						}
						infoWindow.open(map, marker.Mark);
					});

				    } catch (e) {
				        app.showAlert("Error "+JSON.stringify(e));
				    }
				}
				return;
			},
			onNavigateHome: function () {
				//find present location, clear markers and set up members as icons
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
					},
					function (error) {
						//default map coordinates
						position = new google.maps.LatLng(0, -20);
						map.panTo(position);

						that._isLoading = false;
						that.toggleLoading();

						app.notify.showShortTop("Map.Unable to determine current location. Cannot connect to GPS satellite.");
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
			onPlaceSearch: function () {
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

						//map.panTo(results[0].geometry.location);
						for (var i = 0; i < results.length; i++) {
							place = results[i];
							var lat2 = place.geometry.location.lat();
							var lng2 = place.geometry.location.lng();
							var R = 6371; // km
							var dLat = (lat2 - lat1) * Math.PI / 180;
							var dLon = (lng2 - lng1) * Math.PI / 180;
							var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
								Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
								Math.sin(dLon / 2) * Math.sin(dLon / 2);
							var c = 2 * Math.asin(Math.sqrt(a));
							var d = R * c / 1.61; // converted to miles
							place.distance = d.toFixed(2);
							if (app.isNullOrEmpty(place.rating)) {
								place.rating = "??";
							}
							place.isSelected = false;
							place.isSelectedClass = "";
							place.visibility = "hidden";
							if (app.isNullOrEmpty(place.price_level)) {
								place.price_level = 0;
							}
							addMarker(place);
							place.priceString = '$$$$$$$'.substring(0, place.price_level);

							app.Places.locationViewModel.details.push(place);
						}
					} else {
						// Do Place search
						app.notify.showShortTop("Nothing was found in the area shown.");
					}
				});


				function addMarker(place) {
					// If the request succeeds, draw the place location on
					// the map as a marker, and register an event to handle a
					// click on the marker.
					var markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/greencircle.png'; //'http://maps.gstatic.com/mapfiles/circle.png';
					if (place.rating < 3.5) markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/redcircle.png';
					if (place.rating > 4.2) markerUrl = 'http://laverre.com/ys-x6/soft/YS-X6-PC-150413/html/orangecircle.png';

					var marker = new google.maps.Marker({
						map: map,
						position: place.geometry.location,
						icon: {
							//url: 'http://maps.google.com/mapfiles/ms/micons/restaurant.png',
							////url: 'http://maps.gstatic.com/mapfiles/10_blue.png',
							////url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
							//// This marker is 20 pixels wide by 32 pixels high.
							//size: new google.maps.Size(6*place.rating, 6*place.rating),
							//// The origin for this image is (0, 0).
							//origin: new google.maps.Point(0, 0),
							//// The anchor for this image is the base of the flagpole at (0, 32).
							//anchor: new google.maps.Point(0, 32),
							//title:'pizza'
							url: markerUrl,
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
							place.openString = "";
							if (place.opening_hours) {
								if (place.opening_hours.open_now) {
									place.openString = '<a href="tel:' + result.formatted_phone_number + '"><strong> Open - Call Now</strong>';
								}
							}
							place.starString = '<br>No reviews or stars. ';
							if (result.reviews === undefined || result.reviews === undefined) {
								place.starString = '<br>' + result.reviews[0].text.split(". ")[0] + '  ... ' + result.reviews.length + ' reviews and ' + result.rating + ' stars';
							} else {
							    if(place.name) place.name = place.name.replace("&", "%26").replace("&", "%26");
							    if (place.text) { place.text = place.text.replace("&", "%26").replace("&", "%26"); }
							    else { place.text = "Not Available" };
							    var url = encodeURI('components/partners/add.html?Name=' + place.name + '&email=newpartner@on2t.com' + '&longitude=' + place.geometry.location.lng() + '&latitude=' + place.geometry.location.lat() + '&html=hhhhh' + '&icon=styles/images/icon.png' + '&address=' + result.formatted_address.replace('#', '') + '&textField=' + result.reviews[0].text + '&www=' + result.website + '&tel=' + result.formatted_phone_number);
							    place.infoContent = '<div><span onclick="test(\'' + result.website + '\')\"><strong><u>' + result.name + '</u></a></strong><br>' + 'Phone: ' + result.formatted_phone_number + '<br>' + result.formatted_address.replace('#','') + place.starString + '<br/>Distance (about) ' + place.distance + ' miles (ATCF). <br/>' + place.priceString + place.openString + '</span></div><div><table ${visibility} style="width:100%; margin-top:15px"><tr style="width:100%"><td style="width:33%"><a data-role="button" href='
							    + url
                                + ' class="btn-login km-widget km-button">Endorse this Place</a></td></tr></table></div>';
							}
							infoWindow.setContent(place.infoContent);
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

				var directionsService = new google.maps.DirectionsService;
				var directionsDisplay = new google.maps.DirectionsRenderer;
				directionsDisplay.setMap(map);
				var origin_input = document.getElementById('origin-input');
				var destination_input = document.getElementById('destination-input');
				var modes = document.getElementById('mode-selector');

				//map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
				map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
				//map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

				geocoder = new google.maps.Geocoder();
				app.Places.locationViewModel.onNavigateHome.apply(app.Places.locationViewModel, []);
				streetView = map.getStreetView();
				// Create the DIV to hold the control and call the CenterControl()
				// constructor passing in this DIV.
				//var centerControlDiv = document.createElement('div');
				//var centerControl = new CenterControl(centerControlDiv, map);
				//centerControlDiv.index = 1;
				//map.controls[google.maps.ControlPosition.RIGHT_TOP].push(centerControlDiv);
				//google.maps.event.addListener(streetView, 'visible_changed', function () {
				//    if (streetView.getVisible()) {
				//        app.Places.locationViewModel.set("hideSearch", true);
				//    } else {
				//        app.Places.locationViewModel.set("hideSearch", false);
				//    }
				//});
			},
			show: function () {
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
				$("#place-list-view").kendoMobileListView({
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