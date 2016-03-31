/**
 * Places view model
 */

var app = app || {};

app.Places = (function () {
    'use strict'

    var everlive = new Everlive(appSettings.everlive.appId);

    var placesDataSource = new kendo.data.DataSource({
        transport: {
            read: {
                url: "https://api.everlive.com/v1/" + appSettings.everlive.appId + "/Places",
                dataType: "json"
            }
        },
        schema: {
            data: function (response) {
                return response.Result;
            }
        }
    });

    var initialize = function initialize() {
        $("#places-list").kendoMobileListView({
            dataSource: placesDataSource,
            template: "#: Place #"
        });
    }
    return {
        initialize: initialize
    }

})