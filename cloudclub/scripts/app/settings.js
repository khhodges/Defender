/**
 * Application Settings
 */

var appSettings = {
    products: [{ "id": 1, "name": "Banks ", "list": ["bank", "atm"] },
                       { "id": 2, "name": "Business ", "list": ["travel_agency", "roofing_contractor", "plumber", "painter", "locksmith", "lawyer", "laundry", "insurance_agency", "florist", "electrician", "car_wash", "car_repair", "car_dealer", "book_store", "bicycle_store", "beauty_salon", "accounting"] },
                       { "id": 3, "name": "Community ", "list": ["synagogue", "post_office", "police", "park", "museum", "mosque", "local_government_office", "hindu_temple", "funeral_home", "fire_station", "courthouse", "city_hall", "church", "cemetery", "amusement_park"] },
                       { "id": 4, "name": "Education ", "list": ["university", "school", "library", "art_gallery", "aquarium"] },
                       { "id": 5, "name": "Entertainment ", "list": ["zoo", "stadium", "night_club", "movie_theater", "movie_rental", "casino", "bowling_alley"] },
                       { "id": 6, "name": "Groceries ", "list": ["grocery_or_supermarket", "bakery"] },
                       { "id": 7, "name": "Health ", "list": ["veterinary_care", "spa", "physiotherapist", "hospital", "hair_care", "gym", "doctor", "dentist"] },
                       { "id": 8, "name": "Restaurant ", "list": ["restaurant", "meal_takeaway", "meal_delivery", "liquor_store", "convenience_store", "cafe", "bar"] },
                       { "id": 9, "name": "Store ", "list": ["store", "shopping_mall", "shoe_store", "pharmacy", "pet_store", "jewelry_store", "home_goods_store", "hardware_store", "furniture_store", "electronics_store", "department_store", "clothing_store"] },
                       { "id": 10, "name": "Travel ", "list": ["transit_station", "train_station", "taxi_stand", "subway_station", "storage", "rv_park", "real_estate_agency", "parking", "moving_company", "lodging", "gas_station", "embassy", "car_rental", "campground", "bus_station", "airport"] }],

    everlive: {
        appId: '3t5oa8il0d0y02eq', // Put your Backend Services API key here
        scheme: 'http'
    },
    views: {
        init: '#welcome',
        noAppId: 'views/noAppIdView.html',
        signUp: 'views/signupView.html',
        users: 'views/usersView.html',
        main: 'views/placesView.html'
    },
    notification: {
        androidProjectNumber: "AIzaSyDQZoMoLsize-ArAfuGNen0MglbPcoZxWk"
    },
    eqatec: {
        productKey: '3d777b61e0be40f5b61964bb1b05cbbb',  // Put your Tekerik Analytics project key here
        version: '1.0.0.0' // Put your application version here
    },

    feedback: {
        apiKey: '3t5oa8il0d0y02eq'  // Put your AppFeedback API key here
    },

    facebook: {
        appId: '1408629486049918', // Put your Facebook App ID here
        redirectUri: 'https://www.facebook.com/connect/login_success.html' // Put your Facebook Redirect URI here
    },

    google: {
        clientId: '406987471724-q1sorfhhcbulk6r5r317l482u9f62ti8.apps.googleusercontent.com', // Put your Google Client ID here
        redirectUri: 'http://localhost' // Put your Google Redirect URI here
    },

    liveId: {
        clientId: '000000004C10D1AF', // Put your LiveID Client ID here
        redirectUri: 'https://login.live.com/oauth20_desktop.srf' // Put your LiveID Redirect URI here
    },

    adfs: {
        adfsRealm: '$ADFS_REALM$', // Put your ADFS Realm here
        adfsEndpoint: '$ADFS_ENDPOINT$' // Put your ADFS Endpoint here
    },

    messages: {
        mistSimulatorAlert: 'The social login doesn\'t work in the In-Browser Client, you need to deploy the app to a device, or run it in the simulator of the Windows Client or Visual Studio.',
        removeActivityConfirm: 'This activity will be deleted. This action can not be undone.'
    }
};
