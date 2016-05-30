/*
 * 5 ways to customize the infowindow
 * 2015 - en.marnoto.com
*/
'use strict'

var app = app || {};

app.Maps = (function () {
    'use strict'
    var initMaps = function () {
        // map center
        var center = new google.maps.LatLng(40.589500, -8.683542);

        // marker position
        var factory = new google.maps.LatLng(40.589500, -8.683542);

        var initialize = function() {
            var mapOptions = {
                center: center,
                zoom: 18,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            var map = new google.maps.Map(document.getElementById("on2tmap-canvas"), mapOptions);

                // InfoWindow content
            var content = '<div id="iw-container"><div class="iw-title">On2T</div><div class="iw-content"><div class="iw-subTitle">Local Communities, Working Together</div><img src="http://bs2.cdn.telerik.com/v1/3t5oa8il0d0y02eq/77d42a00-b86c-11e5-86a2-6700f56ce9c3" alt="On2T Logo" height="80" width="80"><p>Founded in 2014 to service the individuals and local businesses in any geographic community. The On2T App is "the first example of intimate local communications" that links clients and services in real time.</p><div class="iw-subTitle">Contact On2T</div><p>Pompano Beach, FL<br><br><a href="tel:+19548398525">Call us on +1.954-839-8525</a><br><a href="email:support@on2t.com">support@on2t.com</a><br>www: www.on2t.com</p></div><div class="iw-bottom-gradient"></div></div>';
 //           var content2 = '<div class="iw-title"></div><div class="iw-content"><div class="iw-subTitle" onclick="test('http://www.on2See.com/mobile')"><u>On2T - Local Communities all Working Together</u></div><img src="http://bs2.cdn.telerik.com/v1/3t5oa8il0d0y02eq/77d42a00-b86c-11e5-86a2-6700f56ce9c3" alt="On2T Logo" height="80" width="80"><p>Founded in 2014 to service the individuals and local businesses in any geographic community. The On2T App is "the first example of intimate local communications" linking clients on the move to services in real time.</p><div class="iw-subTitle">Contact On2T</div><a href="tel:+19548398525">Call us on +1.954-839-8525</a><br>www: www.on2t.com</p></div><div class="iw-bottom-gradient"></div>';
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
        }
        google.maps.event.addDomListener(window, 'load', initialize);
    };
    return {
        initOn2t: initMaps,
        showOn2t: Maps.initialize()
    };
})();