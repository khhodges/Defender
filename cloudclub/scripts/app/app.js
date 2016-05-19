function onPushNotificationReceived(e) {
    showAlert(e.message, "On2T Notification");
};

var app = (function (win) {
    'use strict';

    // Global error handling
    var showAlert = function (message, title, callback) {
        navigator.notification.alert(message, callback || function () { }, title, 'OK');
    };

    var showError = function (message) {
        showAlert(message, 'Error occured');
    };

    /*	window.onerror = function (message, file, line) {
	alert("Error: " + message + ", File: " + file + ", Line: " + line);
	}*/



    win.addEventListener('error', function (e) {
        e.preventDefault();

        var message = e.message + "' from " + e.filename + ":" + e.lineno;

        showAlert(message, 'Error occured');

        return true;
    });

    // Global confirm dialog
    var showConfirm = function (message, title, callback) {
        navigator.notification.confirm(message, callback || function () { }, title, ['OK', 'Cancel']);
    };

    var isNullOrEmpty = function (value) {
        return typeof value === 'undefined' || value === null || value === '';
    };

    var isKeySet = function (key) {
        var regEx = /^\$[A-Z_]+\$$/;
        return !isNullOrEmpty(key) && !regEx.test(key);
    };

    // Handle device back button tap
    var onBackKeyDown = function (e) {
        e.preventDefault();

        navigator.notification.confirm('Do you really want to exit?', function (confirmed) {
            var exit = function () {
                navigator.app.exitApp();
            };

            if (confirmed === true || confirmed === 1) {
                // Stop EQATEC analytics monitor on app exit
                if (analytics.isAnalytics()) {
                    analytics.Stop();
                }
                AppHelper.logout().then(exit, exit);
            }
        }, 'Exit', ['OK', 'Cancel']);
    };

    var onDeviceReady = function () {
        // Handle "backbutton" event
        document.addEventListener('backbutton', onBackKeyDown, false);

        //var openExternalInAppBrowser = document.getElementById("openExternalInAppBrowser");
        //openExternalInAppBrowser.addEventListener("click", app.helper.openExternalInAppBrowser);

        var activityRoute = document.getElementById("activityRoute");
        activityRoute.addEventListener("click", app.helper.activityRoute);

        navigator.splashscreen.hide();

        app.mobileApp.navigate("views/mapView.html");

        if (analytics.isAnalytics()) {
            analytics.Start();
        }

        // Initialize AppFeedback
        if (app.isKeySet(appSettings.feedback.apiKey)) {
            try {
                feedback.initialize(appSettings.feedback.apiKey);
            } catch (err) {
                console.log('Something went wrong:');
                console.log(err);
            }
        } else {
            console.log('Telerik AppFeedback API key is not set. You cannot use feedback service.');
        }

        ////register for device notifications
        //el.push.register(devicePushSettings, function () {
        //    app.notify.showShortTop("User.Successful registration in on2t platform. You are ready to receive push notifications.");
        //}, function (err) {
        //    alert("Error: " + err.message);
        //})

        //for notifications
        if (cordova.plugins) {
            // set some global defaults for all local notifications
            cordova.plugins.notification.local.setDefaults({
                ongoing: false, // see http://developer.android.com/reference/android/support/v4/app/NotificationCompat.Builder.html#setOngoing(boolean)
                autoClear: true
            });

            cordova.plugins.notification.local.on("click", function (notification) {
                navigator.notification.alert(JSON.stringify(notification), null, 'Notification background click', 'Close');
            });

            cordova.plugins.notification.local.on("schedule", function (id, state, json) {
                navigator.notification.alert("Scheduled", null, 'Notification scheduled', 'Close');
            });

            // On iOS this event doesn't fire when the app is coldstarted, use "click" above instead in that case
            cordova.plugins.notification.local.on("trigger", function (notification, state) {
                var message = 'Notification with ID is triggered: ' + notification.id + ' state: ' + state;
                navigator.notification.alert(message, function () { // callback invoked when the alert dialog is dismissed
                    // if the app started without clicking the notification, it can be cleared like this:
                    cordova.plugins.notification.local.clear(notification.id, function () {
                        navigator.notification.alert("Notification cleared from notification center");
                    }, 'Notification triggered', 'Close');
                });
            });
        }
    };

    // Handle "deviceready" event
    document.addEventListener('deviceready', onDeviceReady, false);

    // Initialize Everlive SDK
    var el = new Everlive({
        //offlineStorage: true,
        appId: appSettings.everlive.appId,
        scheme: appSettings.everlive.scheme
        //authentaction: {
        //    persist:true
        //}
    });

    var emptyGuid = '00000000-0000-0000-0000-000000000000';

    var devicePushSettings = {
        iOS: {
            badge: 'true',
            sound: 'true',
            alert: 'true'
        },
        android: {
            projectNumber: '419311347951'
        },
        wp8: {
            channelName: 'EverlivePushChannel'
        },
        notificationCallbackIOS: onPushNotificationReceived,
        notificationCallbackAndroid: onPushNotificationReceived,
        notificationCallbackWP8: onPushNotificationReceived
    };

    var AppHelper = {
		
        // Logout user
        logout: function () {
            app.helper.doLogout()
				.then(function (lo) {
				    app.notify.showShortTop("You are logged out.");
				    app.Users.currentUser.data = null;
				    app.helper.navigateHome();
				    var logonB = document.getElementById("logonButton");
				    var logoffB = document.getElementById("logoffButton");
				    logoffB.style.display = "none";
				    logonB.style.display = "";
				},
                function (err) {
                    app.notify.showShortTop("You are not loggon on: " + err.message);
                    app.Users.currentUser.data = null;
                    app.helper.navigateHome();
                    var logonB = document.getElementById("logonButton");
                    var logoffB = document.getElementById("logoffButton");
                    logoffB.style.display = "none";
                    logonB.style.display = "";
				});
        },
        activityRoute: function () {
            if (app.isOnline()) {
                app.mobileApp.navigate('views/activitiesView.html');
            } else {
                app.mobileApp.navigate('components/activities/view.html');
            }

        },
         //Current user logout
        doLogout: function () {
            var lo = el.Users.logout();
            return lo;
        },
        // Navigate to app home
        navigateHome: function () {
            app.mobileApp.navigate('#welcome');
        },

        openExternalInAppBrowser: function () {
            var winB = window.open("http://www.on2t.com/mobile", "_blank");
            app.notify.showShortTop("url.on2t Click 'Done' or 'X' to return to the App");
            //winB.addEventListener("loadstop", function () {
            //    winB.executeScript({ code: "alert( 'Click the X button to return to the App' );" });
            //});
            //winB.addEventListener("loadstop", function () {
            //    setTimeout(function () {
            //        //winB.close();
            //    }, 15000)
            //});
        },


        isAnalytics: function () {
            analytics.isAnalytics();
        },

        checkSimulator: function () {
            if (window.navigator.simulator === true) {
                return true;
            } else if (window.plugins === undefined || window.plugins.toast === undefined) {
                //alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        },

        // Return url for responsive bandwidth
        ResponsiveImageUrl: function (id) {
            el.Files.getById(id)
				.then(function (data) {
				    // get url from data
				    var url = data.result.Uri;
				    var size = "/resize=w:200,h:200,fill:cover/";
				    var base = "https://bs1.cdn.telerik.com/image/v1/";
				    //navigator.notification.alert(url);
				    // convert to responsive url
				    url = base + appSettings.everlive.appId + size + url;
				    return url;
				}),
				function (error) {
				    navigator.notification.alert(JSON.stringify(error));
				};
        },

        // Return absolute user profile picture url
        resolveBackgroundPictureUrl: function (id, option) {
            if (id && id !== emptyGuid) {
                if (option === 'bg') {
                    return 'url(' + el.Files.getDownloadUrl(id) + ')';
                } else {
                    return el.Files.getDownloadUrl(id);
                }
            } else {
                return 'styles/images/avatar.png';
            }
        },

        // Return user profile picture url
        resolveProfilePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return 'styles/images/avatar.png';
            }
        },

        // Return current activity picture url
        resolvePictureUrl: function (id) {
            if (id && id !== emptyGuid) {
                return el.Files.getDownloadUrl(id);
            } else {
                return '';
            }
        },

        // Date formatter. Return date in d.m.yyyy format
        formatDate: function (dateString) {
            return kendo.toString(new Date(dateString), 'MMM dd, yyyy');
        },

        // Like formatter. Return likes count format
        formatLikes: function (likesArray, text) {
            if (likesArray !== undefined) {
                return kendo.toString('Comments: ' + likesArray.length);
            } else {
                return kendo.toString('Be the first to comment!');
            }
        },

        // Geopoint formatter. Return lat/long  format
        formatGeopoint: function (geopoint) {
            if (geopoint !== undefined && geopoint !== null) {
                return kendo.toString('Lat/Long: ' + geopoint.length);
            } else {
                return kendo.toString('Location unknown!');
            }
        },



        autoSizeTextarea: function () {
            var rows = $(this).val().split('\n');
            $(this).prop('rows', rows.length + 1);
        },

        convertToDataURL: function convertToDataURLviaCanvas(url, callback, outputFormat) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function () {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.height;
                canvas.width = this.width;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL(outputFormat, 0.5);
                var ImgData = dataURL.substring("data:image/jepg;base64,".length);
                callback(ImgData);
                canvas = null;
            };
            img.src = url;
        }
    };

    var NotifyHelper = {

        addNotify: function (PartnerId, ActivityId) {
            if (app.Users.currentUser.data) {
                //use everlive
                var data = app.everlive.data('Places');

                var attributes = {
                    "$push": {
                        "AlertList": ActivityId //notiification id
                    }
                };

                var filter = {
                    'Id': PartnerId// TO DO! replace this with the current place, if the place does not exist that register the place
                };

                data.rawUpdate(attributes, filter, function (data) {
                    app.notify.showShortTop("You have sucesfully linked the new notification.");
                }, function (err) {
                    app.notify.showShortTop("Notification failed, please try again.");
                });
            } else {
                app.notify.showShortTop('User.Redirection. You must register and login to access these features.');
                app.mobileApp.navigate('#welcome');
            }
        },

        memorize: function (PartnerId) {
            if (app.Users.currentUser.data) {
                //use everlive
                var data = app.everlive.data('Places');

                //var likedUserId = '790d1f30-b86c-11e5-86a2-6700f56ce9c3'; //user-id';

                var attributes = {
                    "$push": {
                        "Members": app.Users.currentUser.data.Id //liked - user - id
                    }
                };

                var filter = {
                    'Id': PartnerId// TO DO! replace this with the current place, if the place does not exist that register the place
                };

                data.rawUpdate(attributes, filter, function (data) {
                    app.notify.showShortTop("You have sucesfully remembered this place in your favorites list.");
                }, function (err) {
                    app.notify.showShortTop("You have already endorced this place. Visit your favourites to see the full list.");
                });
            } else {
                app.notify.showShortTop('User.Redirection. You must register and login to access these features.');
                app.mobileApp.navigate('#welcome');
            }
        },

        broadcast: function () {
            var activity = app.Activity.activity();
            app.everlive.push.notifications.create({
                Message: activity.Text
            },
				function (data) {
				    var createdAt = app.formatDate(data.result.CreatedAt);
				    app.notify.showShortTop("Notification created: " + createdAt);
				    //update notification assets Activity reference and status
                    //everlive = el
				    var data = el.data('Notifications');
				    data.create({ 'Reference': activity.Id, 'Status':true },
                        function (data) {
                            app.notify.showShortTop(data.message);
                        },
                        function (error) {
                            app.notify.showShortTop(error.message);
                        });
				},
				function (error) {
				    app.showError(JSON.stringify(error));
				})
        },

        showShortTop: function (m) {
            if (analytics.isAnalytics()) {
                m = m + " . . . . . .";
                analytics.TrackFeature('Toast.' + m.substring(0, 10));
            }
            if (!app.helper.checkSimulator()) {
                window.plugins.toast.showShortTop(m);
            } else {
                showAlert(m, "Toast Simulation");
            }
        },

        showMessageWithoutSound: function () {
            this.notify({
                id: 1,
                title: 'I\'m the title!',
                text: 'Sssssh!',
                sound: null,
                at: this.getNowPlus10Seconds()
            });
        },

        showMessageWithDefaultSound: function () {
            this.notify({
                id: '2', // you don't have to use an int by the way.. '1a' or just 'a' would be fine
                title: 'Sorry for the noise',
                text: 'Unless you have sound turned off',
                at: this.getNowPlus10Seconds()
            });
        },

        showMessageWithData: function () {
            this.notify({
                id: 3,
                text: 'I have data, click me to see it',
                json: JSON.stringify({
                    test: 123
                }),
                at: this.getNowPlus10Seconds()
            });
        },

        showMessageWithBadge: function () {
            this.notify({
                id: 4,
                title: 'Your app now has a badge',
                text: 'Clear it by clicking the \'Cancel all\' button',
                badge: 1,
                at: this.getNowPlus10Seconds()
            });
        },

        showMessageWithSoundEveryMinute: function () {
            this.notify({
                id: 5,
                title: 'I will bother you every minute',
                text: '.. until you cancel all notifications',
                every: 'minute',
                autoClear: false,
                at: this.getNowPlus10Seconds()
            });
        },

        cancelAll: function () {
            if (!app.helper.checkSimulator()) {
                cordova.plugins.notification.local.cancelAll(function () {
                    alert('ok, all cancelled')
                });
            }
        },

        getScheduledNotificationIDs: function () {
            if (!app.helper.checkSimulator()) {
                cordova.plugins.notification.local.getScheduledIds(function (scheduledIds) {
                    navigator.notification.alert(scheduledIds.join(', '), null, 'Scheduled Notification ID\'s', 'Close');
                })
            }
        },

        notify: function (payload) {
            if (!app.helper.checkSimulator()) {
                cordova.plugins.notification.local.schedule(payload, function () {
                    console.log('scheduled')
                });
            }
        },

        getLocation: function (callBack) {
            
            var options = {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 2000000
            };

            function success(pos) {
                var crd = pos.coords;
                //console.log('Your current position is:');
                //console.log('Latitude : ' + crd.latitude);
                //console.log('Longitude: ' + crd.longitude);
                //console.log('More or less ' + crd.accuracy + ' meters.');
                callBack(crd);
            };

            function error(err) {
                app.showError('ERROR( Location not available ' + err.code + '): ' + err.message);
            };

            navigator.geolocation.getCurrentPosition(success, error, options);
            
        },

        getNowPlus10Seconds: function () {
            return new Date(new Date().getTime() + 10 * 1000);
        },

        checkSimulator: function () {
            if (window.navigator.simulator === true) {
                alert('This plugin is not available in the simulator.');
                return true;
            } else if (cordova.plugins === undefined || cordova.plugins.notification === undefined) {
                alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                return true;
            } else {
                return false;
            }
        }

    }

    var fileHelper = {

        uploadPhoto: function (imageURI, server) {
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpeg";

            var params = {};
            params.value1 = "test";
            params.value2 = "param";

            options.params = params;

            var ft = new FileTransfer();
            ft.upload(imageURI, encodeURI(server), win, fail, options);
        },

        win: function (r) {
            console.log("Code = " + r.responseCode);
            console.log("Response = " + r.response);
            console.log("Sent = " + r.bytesSent);
        },
        fail: function (error) {
            alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
        }
    }

    var os = kendo.support.mobileOS,
		statusBarStyle = os.ios && os.flatVersion >= 700 ? 'black-translucent' : 'black';

    // Initialize KendoUI mobile application
    var mobileApp = new kendo.mobile.Application(document.body, {
        transition: 'slide',
        statusBarStyle: statusBarStyle,
        skin: 'flat'
    });

    var cropImage = function (image) {
        app.notify.showShortTop("Croping image ...");

        var sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight;
        var starter = document.getElementById(image);
        var canvas = document.getElementById("canvas");
        if (starter.naturalWidth > starter.naturalHeight || starter.naturalWidth === starter.naturalHeight) {
            sx = (starter.naturalWidth - starter.naturalHeight) / 2;
            starterWidth = starter.naturalHeight;
            starterHeight = starter.naturalHeight;
            sy = 0;
        } else {
            sy = (-starter.naturalWidth + starter.naturalHeight) / 2;
            starterWidth = starter.naturalWidth;
            starterHeight = starter.naturalWidth;
            sx = 0;
        }
        dx = 0;
        dy = 0;
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(starter, sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight);
        $baseImage = canvas.toDataURL("image/jpeg", 1.0).substring("data:image/jpeg;base64,".length);
    }

    var createImage = function (baseImage) {
        app.notify.showShortTop("Image.Uploading image ...");

        app.everlive.Files.create({
            Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
            ContentType: "image/jpeg",
            base64: baseImage
        })
			.then(function (promise) {
			    return promise;
			})
    }

    var takePicture = function () {
        takePicture2(console.log("Callback"));
    }
    var takePicture2 = function (callback) {
        app.notify.showShortTop("Camera.Using camera ...");

        navigator.camera.getPicture(function (imageURI) {
            callback(imageURI);
        }, function () {
            app.notify.showShortTop("Camers.No selection was detected.");
        }, {
            //kjhh best result including iphone rotation
            quality: 100,
            destinationType: navigator.camera.DestinationType.FILE_URI,
            sourceType: navigator.camera.PictureSourceType.CAMERA,
            encodingType: navigator.camera.EncodingType.JPEG,
            correctOrientation: true
        });
    }

    var simplify = function (object) {
        var simpleObject = {};
        for (var prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) === 'object') {
                continue;
            }
            if (typeof (object[prop]) === 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }
        return JSON.stringify(simpleObject); // returns cleaned up JSON
    }

    /*	var simpleList = function (censor) {
	var i = 0;

	return function(key, value) {
	if (i !== 0 && typeof(censor) === 'object' && typeof(value) === 'object' && censor === value) 
	return '[Circular]'; 

	if (i >= 29) // seems to be a harded maximum of 30 serialized objects?
	return '[Unknown]';

	++i; // so we know we aren't using the original object anymore

	return value;  
	}
	}
		
	var printList = function(censor){
		
	simpleList(censor);
	var b = {foo: {bar: null}};

	b.foo.bar = b;

	console.log("Censoring: ", b);

	console.log("Result: ", JSON.stringify(b, censor(b)));
	}
	*/
    return {
        data:{},
        showAlert: showAlert,
        showError: showError,
        showConfirm: showConfirm,
        isKeySet: isKeySet,
        mobileApp: mobileApp,
        helper: AppHelper,
        notify: NotifyHelper,
        everlive: el,
        cropImage: cropImage,
        fileHelp: fileHelper,
        takePicture: takePicture,
        saveImage: createImage,
        simplify: simplify,
        isOnline: function () {
            return app.Users.isOnline();
        }
        /*,
                printList: printList*/
    };
}(window));