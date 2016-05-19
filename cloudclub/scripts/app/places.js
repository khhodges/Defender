/**
 * Places view model
 */

var app = app || {};

app.Places = (function () {
    'use strict'

    var placesDataSource = new kendo.data.DataSource({
        type:'everlive',
        typeName: 'Places',
        schema: {
            model: placesDataModel
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