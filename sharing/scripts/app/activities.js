/**
 * Activities view model
 */
'use strict'

var app = app || {};

app.Activities = (function () {
	'use strict'
	var $enterEvent, $newEventText, validator, selected, $baseImage;
	
	var init = function () {
		validator = $('#enterEvent').kendoValidator().data('kendoValidator');
		$enterEvent = $('#enterEvent');	
		$newEventText = $('#newEventText');
		$newEventText.on('keydown', app.helper.autoSizeTextarea);
		validator.hideMessages();
	};
	
	var showTitle = function() {
		var title = document.getElementById("navbarTitle").InnerTEXT;
		title = activities.User().DisplayName;
	}
	
	// Activities model
	var activitiesModel = (function () {
		var activityModel = {

			id: 'Id',
			fields: {
				Text: {
						field: 'Text',
						defaultValue: ''
					},
				CreatedAt: {
						field: 'CreatedAt',
						defaultValue: new Date()
					},
				Picture: {
						fields: 'Picture',
						defaultValue: null
					},
				UserId: {
						field: 'UserId',
						defaultValue: null
					},
				Likes: {
						field: 'Likes',
						defaultValue: []
					}
			},
			CreatedAtFormatted: function () {
				return app.helper.formatDate(this.get('CreatedAt'));
			},
			
			LikesCount: function () {
				return app.helper.formatLikes(this.get('Likes'), this.get('Text'));
			},
			
			PictureUrl: function () {
				return app.helper.resolvePictureUrl(this.get('Picture'));
			},
			/*			ResponsivePictureUrl: function () {
			var result = app.helper.ResponsiveImageUrl(this.get('Picture'));
			return result;
			},*/
			
			ResponsivePictureUrl: function () {
				var id = this.get('Picture');
				var el = new Everlive(appSettings.everlive.appId);
				el.Files.getById(id).then
				(function(data) {
					// get url from data
					var url = data.result.Uri;
					var size = "/resize=w:200,h:200,fill:cover/";
					var base = "https://bs1.cdn.telerik.com/image/v1/";
					//navigator.notification.alert(url);
					// convert to responsive url
					url = base + appSettings.everlive.appId + size + url;
					return url;
				}),
				function(error) {
					navigator.notification.alert(JSON.stringify(error));
				}
			},
			
			User: function () {
				var userId = this.get('UserId');
				if (userId === undefined) {
					showHelp("userID is null");
					userId = app.Users.currentUser.data.Id;
				}

				var user = $.grep(app.Users.users(), function (e) {
					return e.Id === userId;
				})[0];

				return user ? {
					DisplayName: user.DisplayName,
					PictureUrl: app.helper.resolveProfilePictureUrl(user.Picture),
					urlPictureUrl: app.helper.resolveBackgroundPictureUrl(user.Picture,'bg')
				} : {
					DisplayName: app.Users.currentUser.data.DisplayName,
					PictureUrl: app.helper.resolveProfilePictureUrl(app.Users.currentUser.data.Picture),
					urlPictureUrl: app.helper.resolveBackgroundPictureUrl(app.Users.currentUser.data.Picture,'bg')
				};
			},
			isVisible: function () {
				var currentUserId = app.Users.currentUser.data.Id;
				var userId = this.get('UserId');

				return currentUserId === userId;
			}
		};
		// Activities data source. The Backend Services dialect of the Kendo UI DataSource component
		// supports filtering, sorting, paging, and CRUD operations.
		var activitiesDataSource = new kendo.data.DataSource({
																 type: 'everlive',
																 schema: {
				model: activityModel
			},
																 transport: {
				// Required by Backend Services
				typeName: 'Activities'
			},
																 change: function (e) {
																	 if (e.items && e.items.length > 0) {
																		 $('#no-activities-span').hide();
																	 } else {
																		 $('#no-activities-span').show();
																	 }
																 },
																 sort: {
				field: 'CreatedAt',
				dir: 'desc'
			},
																 filter:{
				field: "UserId", operator: "neq", value: "undefined"				
			}
															 });

		return {
			activities: activitiesDataSource
		};
	}());

	// Activities view model
	var activitiesViewModel = (function () {
		// Navigate to activityView When some activity is selected
		var activitySelected = function (e) {
			app.mobileApp.navigate('views/activityView.html?uid=' + e.data.uid);
		};

		// Navigate to app home
		var navigateHome = function () {
			app.mobileApp.navigate('#welcome');
		};

		// Logout user
		var logout = function () {
			app.helper.logout()
				.then(navigateHome, function (err) {
					app.showError(err.message);
					navigateHome();
				});
		};

		var crop = function () {
			var sx, sy, starterWidth, starterHeight, dx, dy, canvasWidth, canvasHeight;
			var starter = document.getElementById("picture");
			var canvas = document.getElementById("canvas");
			if (starter.naturalWidth > starter.naturalHeight) {
				sx = (starter.naturalWidth - starter.naturalHeight) / 2;
				starterWidth = starter.naturalHeight;
				starterHeight = starter.naturalHeight;
				sy = 0;
			} else {
				sy = (- starter.naturalWidth + starter.naturalHeight) / 2;
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
		var saveActivity = function () {
			// Validating of the required fields
			if (validator.validate()) {
				$enterEvent.style.display = 'none';				
				// Adding new comment to Comments model
				var activities = app.Activities.activities;
				var activity = activities.add();                
				activity.Text = $newEventText.val();
				$newEventText.Val = "";
				activity.UserId = app.Users.currentUser.get('data').Id; 				
				document.getElementById('addButton').innerText = "Add Event";
				app.mobileApp.showLoading();
				activities.sync();
				app.mobileApp.hideLoading();
			}
		};
		
		var saveImageActivity = function () {
			// Validating of the required fields
			if (selected === undefined || !$baseImage) {
				app.showAlert("First take a photo with your camera and then add a message to match!", "Informational");
			}
			if (validator.validate() && (selected !== undefined)) {				
				if (!app.helper.checkSimulator()) {
					app.notify.showShortTop("Uploading image... please wait");
					//window.plugins.toast.showShortTop("Uploading image ...")
				}
				;
				app.mobileApp.showLoading();
				// Save image as base64 to everlive
				app.everlive.Files.create({
											  Filename: Math.random().toString(36).substring(2, 15) + ".jpg",
											  ContentType: "image/jpeg",
											  base64: $baseImage
										  })
					.then(function (promise) {
						selected = promise.result.Id;

						// Adding new activity to Activities model
						var activities = app.Activities.activities;
						var activity = activities.add();
						activity.Text = document.getElementById('newEventText').value;
						activity.UserId = app.Users.currentUser.get('data').Id;
						activity.Picture = selected;
						activities.sync();						
						$enterEvent.style.display = 'none';
						validator.hideMessages();
						document.getElementById('addButton').innerText = "Add Event";
						document.getElementById('newEventText').value = "";
						document.getElementById('picture').src = "styles/images/default-image.jpg";
						app.mobileApp.hideLoading();
					})
			}
		};
		var addActivity = function () {
			$enterEvent = document.getElementById('enterEvent');
			if ($enterEvent.style.display === 'block') {
				$enterEvent.style.display = 'none';
				validator.hideMessages();
				document.getElementById('addButton').innerText = "Add Event";
				document.getElementById('newEventText').value = "";
				document.getElementById('picture').src = "styles/images/default-image.jpg";
			} else {
				$enterEvent.style.display = 'block';
				document.getElementById('addButton').innerText = "Cancel";
			}
		};
		
		var success = function (imageURI) {
			selected = imageURI;
			var picture = document.getElementById("picture");
			picture.src = selected;
		}

		var error = function () {
			app.showError("No selection was detected.");			
			$enterEvent.style.display = 'none';
			validator.hideMessages();
			document.getElementById('addButton').innerText = "Add Event";
			document.getElementById('newEventText').value = "";
		};
		
		var pickImage = function (e) {
			$enterEvent = document.getElementById('enterEvent');
			app.mobileApp.navigate('#view-all-activities');
			if ($enterEvent.style.display === 'block') {
				$enterEvent.style.display = 'none';
				validator.hideMessages();
				document.getElementById('addButton').innerText = "Add Event";
				document.getElementById('newEventText').value = "";
				document.getElementById('picture').src = "styles/images/default-image.jpg";
			} else {
				$enterEvent.style.display = 'block';
				document.getElementById('addButton').innerText = "Cancel";
				navigator.camera.getPicture(success, error, {
												//kjhh best result including iphone rotation
												quality: 100, 
												destinationType: navigator.camera.DestinationType.FILE_URI,
												sourceType: navigator.camera.PictureSourceType.CAMERA,
												encodingType: navigator.camera.EncodingType.JPEG,
												correctOrientation: true
											});
			}
		};
		
		return {
			init: init,
			activities: activitiesModel.activities,
			activitySelected: activitySelected,
			logout: logout,
			addActivity: pickImage,
			saveActivity: saveImageActivity,
			show: showTitle,
			crop: crop
		};
	}());

	return activitiesViewModel;
}());