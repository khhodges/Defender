/**
 * Members view model
 */

var app = app || {};

app.on2tClients = (function () {
    'use strict'
    var locals, mapOptions;
        // map center
    var center = new google.maps.LatLng(40.589500, -8.683542);

    // marker position
    var factory = new google.maps.LatLng(40.589500, -8.683542);

    var clientViewModel = (function () {
        var properties
        var clientClassModel = {
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
        var clientDataSource = new kendo.data.DataSource({
            type: 'everlive',
            schema: {
                model: clientModel
            },
            transport: {
                typeName: 'Places'
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
            init: function () {
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
            viewModel: new clientViewModel(),
            onSelected: function (e) {
            }
        };
    });
    return {
        clientViewModel: clientViewModel,
        initClients: function () {
            var mapOptions = {
                center: center,
                zoom: 18,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("on2tmap-canvas"), mapOptions);

            // InfoWindow content
            var content = '<div id="iw-container">' +
                              '<div class="iw-title">Porcelain Factory of Vista Alegre</div>' +
                              '<div class="iw-content">' +
                                '<div class="iw-subTitle">History</div>' +
                                '<img src="images/vistalegre.jpg" alt="Porcelain Factory of Vista Alegre" height="115" width="83">' +
                                '<p>Founded in 1824, the Porcelain Factory of Vista Alegre was the first industrial unit dedicated to porcelain production in Portugal. For the foundation and success of this risky industrial development was crucial the spirit of persistence of its founder, José Ferreira Pinto Basto. Leading figure in Portuguese society of the nineteenth century farm owner, daring dealer, wisely incorporated the liberal ideas of the century, having become "the first example of free enterprise" in Portugal.</p>' +
                                '<div class="iw-subTitle">Contacts</div>' +
                                '<p>VISTA ALEGRE ATLANTIS, SA<br>3830-292 Ílhavo - Portugal<br>' +
                                '<br>Phone. +351 234 320 600<br>e-mail: geral@vaa.pt<br>www: www.myvistaalegre.com</p>' +
                              '</div>' +
                              '<div class="iw-bottom-gradient"></div>' +
                            '</div>';
            // A new Info Window is created and set content
            var infowindow = new google.maps.InfoWindow({
                content: content,
                // Assign a maximum value for the width of the infowindow allows
                // greater control over the various content elements
                maxWidth: 350
            });
            // marker options
            var marker = new google.maps.Marker({
                position: factory,
                map: map,
                title: "Fábrica de Porcelana da Vista Alegre"
            });
            // This event expects a click on a marker
            // When this event is fired the Info Window is opened.
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });
            // Event that closes the Info Window with a click on the map
            google.maps.event.addListener(map, 'click', function () {
                infowindow.close();
            });
            // *
            // START INFOWINDOW CUSTOMIZE.
            // The google.maps.event.addListener() event expects
            // the creation of the infowindow HTML structure 'domready'
            // and before the opening of the infowindow, defined styles are applied.
            // *
            google.maps.event.addListener(infowindow, 'domready', function () {
                // Reference to the DIV that wraps the bottom of infowindow
                var iwOuter = $('.gm-style-iw');
                /* Since this div is in a position prior to .gm-div style-iw.
                 * We use jQuery and create a iwBackground variable,
                 * and took advantage of the existing reference .gm-style-iw for the previous div with .prev().
                */
                var iwBackground = iwOuter.prev();
                // Removes background shadow DIV
                iwBackground.children(':nth-child(2)').css({ 'display': 'none' });
                // Removes white background DIV
                iwBackground.children(':nth-child(4)').css({ 'display': 'none' });
                // Moves the infowindow 115px to the right.
                iwOuter.parent().parent().css({ left: '115px' });
                // Moves the shadow of the arrow 76px to the left margin.
                iwBackground.children(':nth-child(1)').attr('style', function (i, s) { return s + 'left: 76px !important;' });
                // Moves the arrow 76px to the left margin.
                iwBackground.children(':nth-child(3)').attr('style', function (i, s) { return s + 'left: 76px !important;' });
                // Changes the desired tail shadow color.
                iwBackground.children(':nth-child(3)').find('div').children().css({ 'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index': '1' });
                // Reference to the div that groups the close button elements.
                var iwCloseBtn = iwOuter.next();
                // Apply the desired effect to the close button
                iwCloseBtn.css({ opacity: '1', right: '38px', top: '3px', border: '7px solid #48b5e9', 'border-radius': '13px', 'box-shadow': '0 0 5px #3990B9' });
                // If the content of infowindow not exceed the set maximum height, then the gradient is removed.
                if ($('.iw-content').height() < 140) {
                    $('.iw-bottom-gradient').css({ display: 'none' });
                }
                // The API automatically applies 0.7 opacity to the button after the mouseout event. This function reverses this event to the desired value.
                iwCloseBtn.mouseout(function () {
                    $(this).css({ opacity: '1' });
                });
            });

        },
        showClients: function () {

        }
    }

}());
