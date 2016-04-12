/**
 * Activity view model
 */

var app = app || {};

app.Activity = (function () {
	'use strict'
    
	var $commentsContainer,
		$enterComment,
		listScroller, 
		$newComment,
		showComment,
		stars,
		thePictureUrl,
		validator;
    
	var activityViewModel = (function () {
		var activityUid,
			activity,
			$activityPicture;
        
		var init = function () {
			$commentsContainer = $('#comments-listview');
			$activityPicture = $('#picture');
			validator = $('#enterComment').kendoValidator().data('kendoValidator');
			$newComment = $('#newComment');

			$newComment.on('keydown', app.helper.autoSizeTextarea);
			$newComment.on('keydown', validator.hideMessages());
		};
        
		var show = function (e) {
			$commentsContainer.empty();
			validator.hideMessages();
			showComment = false;
			listScroller = e.view.scroller;
			listScroller.reset();
			activityUid = e.view.params.uid;
			// Get current activity (based on item uid) from Activities model
			activity = app.Activities.activities.getByUid(activityUid);
			app.everlive.Files.getById(activity.Picture).then(
				function(data) {
					//alert(JSON.stringify(data));
					thePictureUrl = data.result.Uri
				}, 
				function(error) {
					app.showAlert("Picture File not found. Please try again.");
				});
			
			$activityPicture[0].style.display = activity.Picture ? 'block' : 'none';			
			
			    app.notify.showShortTop("Activity.Checking for Comments ...")
			
			//app.mobileApp.showLoading();
			app.Comments.comments.filter({
											 field: 'ActivityId',
											 operator: 'eq',
											 value: activity.Id
										 });
			app.mobileApp.hideLoading();
			kendo.bind(e.view.element, activity, kendo.mobile.ui);
		};
        
		var removeActivity = function () {
			var activities = app.Activities.activities;
			var activity = activities.getByUid(activityUid);
            
			app.showConfirm(
				appSettings.messages.removeActivityConfirm,
				'Delete Activity',
				function (confirmed) {
				    if (confirmed === true || confirmed === 1) {
				        app.notify.showShortTop("Activity.removed");
						activities.remove(activity);
						activities.one('sync', function () {
							app.mobileApp.navigate('#:back');
						});
						activities.sync();
					}
				}
				);
		};
		
		var saveComment = function () {
			// Validating of the required fields
			if (validator.validate()) {
				$enterComment.style.display = 'none';
				
				// Adding new comment to Comments model
				var comments = app.Comments.comments;
				var comment = comments.add();
                
				comment.Comment = $newComment.val() + " Stars: " + stars;

				comment.UserId = app.Users.currentUser.get('data').Id;
				comment.ActivityId = app.Activity.activity().Id;
                
				app.notify.showShortTop("Updating Comments ...")
				
				comments.sync();
				$newComment.Val = "";
				
				document.getElementById("one").style.visibility = "hidden";
				document.getElementById("two").style.visibility = "hidden";				
				document.getElementById("three").style.visibility = "hidden";
				document.getElementById("four").style.visibility = "hidden";
				document.getElementById("five").style.visibility = "hidden";
			    //update Likes
			    // Adding new activity to Activities model
				var activities = app.Activities.activities;
				var activity = activities.getByUid(activityUid);
				activity.Likes.push(comment.UserId);
				activities.sync();
			}
		};
		var addComment = function () {
			$enterComment = document.getElementById('enterComment');
			if ($enterComment.style.display === 'block') {
				$enterComment.style.display = 'none';
				validator.hideMessages();
			} else {
				$enterComment.style.display = 'block';
				document.getElementById('newComment').value = "";
			}
		};  
		
		var addStar = function() {
			if (document.getElementById("one").style.visibility === "hidden") {
				document.getElementById("one").style.visibility = "visible";
				stars = 1;
			}else {
				if (document.getElementById("two").style.visibility === "hidden") {
					document.getElementById("two").style.visibility = "visible";
					stars = 2;
				}else {
					if (document.getElementById("three").style.visibility === "hidden") {
						document.getElementById("three").style.visibility = "visible";
						stars = 3;
					}else {
						if (document.getElementById("four").style.visibility === "hidden") {
							document.getElementById("four").style.visibility = "visible";
							stars = 4;
						}else {
							if (document.getElementById("five").style.visibility === "hidden") {
								document.getElementById("five").style.visibility = "visible";
								stars = 5;
							}else {
								document.getElementById("one").style.visibility = "hidden";
								document.getElementById("two").style.visibility = "hidden";				
								document.getElementById("three").style.visibility = "hidden";
								document.getElementById("four").style.visibility = "hidden";
								document.getElementById("five").style.visibility = "hidden";
								stars = 0;
							}
						}
					}
				}
			}
		}
		
		var share = function () {
			var activities = app.Activities.activities;
			var activity = activities.getByUid(activityUid);
			var comments;
			comments = "\n COMMENTS: \n";
			var message = activity.Text;
			if (!app.Comments.comments === undefined) {
			    app.Comments.comments.data().forEach(function (entry) { comments = comments + entry.CreatedAt + ": " + entry.Comment + "... " + entry.User.DisplayName + "\n"; });
			     message = message + comments;
			}
			var title = app.Users.currentUser.data.DisplayName;
			var link = thePictureUrl;
			if (!app.helper.checkSimulator()) {
			    window.plugins.toast.showLongBottom("Share options now being loaded for, " + message + ", " + title + ", " + link + ", please wait...");
			    app.shareEmail("The following posting is shared by " + title + ": " + message + ", " + link, link);
			} else {
			    app.showAlert("Share options now being loaded for, " + message + ", " + title + ", " + link + ", please wait...");
			}
		}
		
		return {
			init: init,
			show: show,
			remove: removeActivity,
			addComment: addComment,
			saveComment: saveComment,
			activity: function () {
				return activity;
			},
			addStar: addStar,
			share: share
		};
	}()
	);
    
	return activityViewModel;
}());