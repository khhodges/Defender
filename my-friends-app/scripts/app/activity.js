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
			$activityPicture[0].style.display = activity.Picture ? 'block' : 'none';			
			if (!app.helper.checkSimulator) {
				window.plugins.toast.showShortTop("Downloading ...")
			}
			;
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
                
				if (!app.helper.checkSimulator) {
					window.plugins.toast.showShortTop("Updating Comments ...")
				}
				comments.sync();
				$newComment.Val = "";
				
				document.getElementById("one").style.visibility = "hidden";
				document.getElementById("two").style.visibility = "hidden";				
				document.getElementById("three").style.visibility = "hidden";
				document.getElementById("four").style.visibility = "hidden";
				document.getElementById("five").style.visibility = "hidden";
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
			var message = activity.Text;
			var title = app.Users.currentUser.data.DisplayName;
			var link = activity.PictureUrl();
			if (!app.helper.checkSimulator) {
				window.plugins.toast.showLongBottom("Share options now being loaded, please wait...");
				app.showAlert(message, title, link);
				window.plugins.socialsharing.share(message, title, link);
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