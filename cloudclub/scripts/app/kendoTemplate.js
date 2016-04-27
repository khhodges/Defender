/**
 * Members view model
 */

var app = app || {};

app.newClass = (function () {
    'use strict'
    var locals;
    var newClassViewModel = (function () {
        var properties
        var classModel = {
            fields: {
                item: {
                    field: 'Item',
                    defaultValue: 'itemField'
                }
            }
        };
        var newClassDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: newClassModel
            },
            transport: {
                typeName: 'Class'
            }
        });
        var itemViewModel = kendo.data.ObservableObject.extend({
            attribute: null,
            isViewInitialized: false,
            markers: [],
            details: [],
            hideView: false,
            itemMarker: function (marker, text) {
                var itemPosition = new google.maps.LatLng(marker.latitude, marker.longitude);
                marker.Mark = new google.maps.Marker({
                    map: map,
                    position: position,
                    icon: {
                        url: 'styles/images/icon.png',
                        anchor: new google.maps.Point(20, 38),
                        scaledSize: new google.maps.Size(40, 40)
                    }
                });
                google.maps.event.addListener(marker.Mark, 'click', function () {
                    infoWindow.setContent(text);
                    infoWindow.open(map, marker.Mark);
                });
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

                }

                map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

            },
            show: function () {
                //resize the map in case the orientation has been changed 
                google.maps.event.trigger(map, "resize");
            },
            hide: function () {
                //hide loading mask if user changed the tab as it is only relevant to location tab
                kendo.mobile.application.hideLoading();
            },
            newClassViewModel: new newClassViewModel(),
            onSelected: function (e) {
            }
        };
    }());
    return newClassViewModel;
}());
