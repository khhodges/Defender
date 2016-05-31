'use strict';

app.home = kendo.observable({
	onShow: function () {},
	afterShow: function () {}
});

// START_CUSTOM_CODE_home
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_home
(function (parent) {
	var dataProvider = app.data.defender,
		addGeopoint,
		fetchFilteredData = function (paramFilter, searchFilter) {
			var model = parent.get('homeModel'),
				dataSource = model.get('dataSource');

			if (paramFilter) {
				model.set('paramFilter', paramFilter);
			} else {
				model.set('paramFilter', undefined);
			}

			if (paramFilter && searchFilter) {
				dataSource.filter({
					logic: 'and',
					filters: [paramFilter, searchFilter]
				});
			} else if (paramFilter || searchFilter) {
				dataSource.filter(paramFilter || searchFilter);
			} else {
				dataSource.filter({});
			}
		},
		processImage = function (img) {
			if (!img) {
				var empty1x1png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVQI12NgYAAAAAMAASDVlMcAAAAASUVORK5CYII=';
				img = 'data:image/png;base64,' + empty1x1png;
			} else if (img.slice(0, 4) !== 'http' &&
				img.slice(0, 2) !== '//' && img.slice(0, 5) !== 'data:') {
				var setup = dataProvider.setup || {};
				img = setup.scheme + ':' + setup.url + setup.appId + '/Files/' + img + '/Download';
			}

			return img;
		},
		flattenLocationProperties = function (dataItem) {
			var propName, propValue,
				isLocation = function (value) {
					return propValue && typeof propValue === 'object' &&
						propValue.longitude && propValue.latitude;
				};

			for (propName in dataItem) {
				if (dataItem.hasOwnProperty(propName)) {
					propValue = dataItem[propName];
					if (isLocation(propValue)) {
						dataItem[propName] =
							kendo.format('Latitude: {0}, Longitude: {1}',
								propValue.latitude, propValue.longitude);
					}
				}
			}
		},
		dataSourceOptions = {
			type: 'everlive',
			transport: {
				typeName: 'Places',
				dataProvider: dataProvider
			},
			change: function (e) {
				var data = this.data();
				for (var i = 0; i < data.length; i++) {
					var dataItem = data[i];

					dataItem['ImageUrl'] =
						processImage(dataItem['Image']);

					//flattenLocationProperties(dataItem);
				}
			},
			error: function (e) {
				if (e.xhr) {
					alert(JSON.stringify(e.xhr));
				}
			},
			schema: {
				model: {
					fields: {
						'Place': {
							field: 'Place',
							defaultValue: ''
						},
						'Address': {
							field: 'Address',
							defaultValue: ''
						},
						'Image': {
							field: 'Image',
							defaultValue: ''
						},
						'Id': {
							field: 'Id',
							defaultValue: ''
						},
					}
				}
			},
			serverFiltering: true,
		},
		dataSource = new kendo.data.DataSource(dataSourceOptions),
		homeModel = kendo.observable({
			dataSource: dataSource,
			searchChange: function (e) {
				var searchVal = e.target.value,
					searchFilter;

				if (searchVal) {
					searchFilter = {
						field: 'Place',
						operator: 'contains',
						value: searchVal
					};
				}
				fetchFilteredData(homeModel.get('paramFilter'), searchFilter);
			},
			itemClick: function (e) {

				app.mobileApp.navigate('#components/partners/details.html?uid=' + e.dataItem.uid);

			},
			addClick: function () {
				app.mobileApp.navigate('#components/partners/add.html');
			},
			//kjhh
			likeClick: function () {
				app.notify.memorize(dataSource.Id);
			},
			detailsShow: function (e) {
				var item = e.view.params.uid,
					dataSource = homeModel.get('dataSource'),
					itemModel = dataSource.getByUid(item);
				itemModel.ImageUrl = processImage(itemModel.Image);

				if (!itemModel.Place) {
					itemModel.Place = String.fromCharCode(160);
				}

				homeModel.set('currentItem', null);
				homeModel.set('currentItem', itemModel);
			},
			addShow: function (e) {
				document.getElementById("Place").innerText = e.view.params.Name;
			},
			currentItem: null
		});

	parent.set('addItemViewModel', kendo.observable({
		onShow: function (e) {
			addGeopoint = e.view.params.location;
			// Reset the form data.
			this.set('addFormData', {
			    place: e.view.params.Name.replace( "%26","&").replace("%26","&" ),
				id: e.view.params.placeId,
				www: e.view.params.www,
				textField: e.view.params.textField,
				longitude: e.view.params.longitude,
				latitude: e.view.params.latitude,
				email: e.view.params.email,
				html: e.view.params.html,
				icon: e.view.params.icon,
				address: e.view.params.address,
				tel: e.view.params.tel,
			});
		},
		onSaveClick: function (e) {
			if (!app.isOnline()) {
			    app.notify.showShortTop("Please register and login");
				app.mobileApp.navigate('#welcome');
			} else {
				var addFormData = this.get('addFormData'),
					dataSource = homeModel.get('dataSource');
				var longitude = parseFloat(addFormData.longitude);
				var latitude = parseFloat(addFormData.latitude);
				var Location = {
						"longitude": longitude,
						"latitude": latitude
					}
					//var Location = new Everlive.GeoPoint(addFormData.longitude /* longitude */, addFormData.latitude /* latitude */);
					//Location.push(addFormData.longitude);
					//Location.push(addFormData.latitude);
				dataSource.add({
					PlaceId: addFormData.id,
					Place: addFormData.place,
					Website: addFormData.www,
					Location: Location,
					Email: addFormData.email,
					Html: addFormData.html,
					Icon: addFormData.icon,
					Description: addFormData.textField,
					Address: addFormData.address,
					Phone: addFormData.tel,
				});

				dataSource.one('change', function (e) {
					app.mobileApp.navigate('#:back');
				});

				dataSource.sync();
				app.notify.showShortTop("The new location has been added to your Favourites!");
			}
		}
	}));

	if (typeof dataProvider.sbProviderReady === 'function') {
		dataProvider.sbProviderReady(function dl_sbProviderReady() {
			parent.set('homeModel', homeModel);
		});
	} else {
		parent.set('homeModel', homeModel);
	}

	parent.set('onShow', function (e) {
		var param = e.view.params.filter ? JSON.parse(e.view.params.filter) : null;
		if ((param === null || param === undefined) && e.view.params.partner) param = {
			"field": "Place",
			"operator": "contains",
			"value": e.view.params.partner
		};
		fetchFilteredData(param);
	});
})(app.home);

// START_CUSTOM_CODE_homeModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_homeModel