(function (global) {
    'use strict';

    var app = global.app = global.app || {};

    app.showAlert = function (message, title, callback) {
        navigator.notification.alert(message, callback || function () {
        }, title, 'OK');
    };

    app.showError = function (message) {
        app.showAlert(message, 'Error occured');
    };

    app.showLoading = function () {
        app.mobileApp.showLoading();
    };

    app.hideLoading = function () {
        app.mobileApp.hideLoading();
    };

    app.navigateToView = function (view) {
        app.mobileApp.navigate(view);
    };

    app.logout = function () {
        navigator.notification.confirm('Are your sure?', function (buttonIndex) {
            if (buttonIndex === 1) {
                app.notify.showShortTop("User.Logout Confirmed");
                appConsole.clear();
                app.everlive.Users.logout();
                app.navigateToView(app.config.views.init);
                app.mobileApp.navigate('#welcome');
            } else {

                app.mobileApp.navigate('views/activitiesView.html');
                app.notify.showShortTop("User.Logout Un-Click");
            }
        }, "Logout", ["OK", "Cancel"]);
    };

    app.getYear = function () {
        return new Date().getFullYear();
    };

    app.isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    app.isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !app.isNullOrEmpty(key) && !regEx.test(key);
    };

    app.formatDate = function (dateString) {
        var formattedDate = kendo.toString(new Date(dateString), 'G');

        return formattedDate;
    };

    app.currentUserUsername = kendo.observable({ "username": null });

    app.getSelectedUsersFromDataSource = function () {
        var dataSource = app.Users.usersData;
        var data = dataSource.view();

        var checkedUsers = [];

        $(data).map(function (index, item) {
            if (item.isSelected) {
                checkedUsers.push(item.Id);
                item.set("isSelected", false);
            }
        });

        return checkedUsers;
    };
}(window));
