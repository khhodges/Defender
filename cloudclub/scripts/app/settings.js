/**
 * Application Settings
 */

var appSettings = {
    items: [{ "id": 1, "name": "Banks ", "list": ["bank", "atm"] },
                       { "id": 2, "name": "Business ", "list": ["travel_agency", "roofing_contractor", "plumber", "painter", "locksmith", "lawyer", "laundry", "insurance_agency", "florist", "electrician", "car_wash", "car_repair", "car_dealer", "book_store", "bicycle_store", "beauty_salon", "accounting"] },
                       { "id": 3, "name": "Community ", "list": ["synagogue", "post_office", "police", "park", "museum", "mosque", "local_government_office", "hindu_temple", "funeral_home", "fire_station", "courthouse", "city_hall", "church", "cemetery", "amusement_park"] },
                       { "id": 4, "name": "Education ", "list": ["university", "school", "library", "art_gallery", "aquarium"] },
                       { "id": 5, "name": "Entertainment ", "list": ["zoo", "stadium", "night_club", "movie_theater", "movie_rental", "casino", "bowling_alley"] },
                       { "id": 6, "name": "Groceries ", "list": ["grocery_or_supermarket", "bakery"] },
                       { "id": 7, "name": "Health ", "list": ["veterinary_care", "spa", "physiotherapist", "hospital", "hair_care", "gym", "doctor", "dentist"] },
                       { "id": 8, "name": "Restaurant ", "list": ["restaurant", "meal_takeaway", "meal_delivery", "liquor_store", "convenience_store", "cafe", "bar"] },
                       { "id": 9, "name": "Store ", "list": ["store", "shopping_mall", "shoe_store", "pharmacy", "pet_store", "jewelry_store", "home_goods_store", "hardware_store", "furniture_store", "electronics_store", "department_store", "clothing_store"] },
                       { "id": 10, "name": "Travel ", "list": ["transit_station", "train_station", "taxi_stand", "subway_station", "storage", "rv_park", "real_estate_agency", "parking", "moving_company", "lodging", "gas_station", "embassy", "car_rental", "campground", "bus_station", "airport"] }],

    products2: [{ "id": 1, "name": "Banks ", "list": ["bank", "atm"] },
                       { "id": 2, "name": "Business ", "list": ["laundry", "florist", "electrician", "book_store", "bicycle_store", "beauty_salon", "accounting"] },
                       { "id": 3, "name": "Community ", "list": ["post_office", "police", "park", "local_government_office", "fire_station", "city_hall"] },
                       { "id": 4, "name": "Education ", "list": ["museum", "university", "zoo", "school", "library", "art_gallery", "aquarium"] },
                       { "id": 5, "name": "Entertainment ", "list": ["amusement_park", "stadium", "night_club", "movie_theater", "movie_rental", "casino", "bowling_alley"] },
                       { "id": 6, "name": "Groceries ", "list": ["grocery_or_supermarket", "liquor_store", "convenience_store", "bakery"] },
                       { "id": 7, "name": "Health ", "list": ["pharmacy", "physiotherapist", "hospital", "doctor", "dentist"] },
                       { "id": 8, "name": "Restaurants ", "list": ["restaurant", "meal_takeaway", "meal_delivery", "cafe", "bar"] },
                       { "id": 9, "name": "Store ", "list": ["store", "shopping_mall", "shoe_store", "jewelry_store", "furniture_store", "electronics_store", "department_store", "clothing_store"] },
                       { "id": 10, "name": "Travel ", "list": ["transit_station", "train_station", "taxi_stand", "subway_station", "campground", "bus_station", "airport", "car_rental"] },
                       { "id": 11, "name": "Agencies", "list": ["real_estate_agency", "travel_agency", "real_estate_agency", "insurance_agency", "moving_company"] },
                       { "id": 12, "name": "Legal", "list": ["courthouse", "embassy", "lawyer"] },
                       { "id": 13, "name": "Jobs", "list": ["home_goods_store", "hardware_store", "locksmith", "roofing_contractor", "plumber", "painter", ] },
                       { "id": 14, "name": "Cars", "list": ["gas_station", "car_wash", "car_repair", "car_dealer", "rv_park", "parking", ] },
                       { "id": 15, "name": "Moving", "list": ["moving_company", "storage", "lodging", ] },
                       { "id": 16, "name": "Pets", "list": ["veterinary_care", "pet_store"] },
                       { "id": 17, "name": "Religions", "list": ["hindu_temple", "church", "funeral_home", "cemetery", "mosque", "synagogue", ] },
    { "id": 18, "name": "Beauty ", "list": ["pharmacy", "spa", "hair_care", "gym"] }
    ],
    products:
         [{ "id": 1, "name": "accounting", "search": "accounting" },
 { "id": 2, "name": "airport", "search": "airport" },
 { "id": 3, "name": "amusement_park", "search": "amusement park" },
 { "id": 4, "name": "aquarium", "search": "aquarium" },
 { "id": 5, "name": "art_gallery", "search": "art gallery" },
 { "id": 6, "name": "atm", "search": "atm" },
 { "id": 7, "name": "bakery", "search": "bakery" },
 { "id": 8, "name": "bank", "search": "bank" },
 { "id": 9, "name": "bar", "search": "bar" },
 { "id": 10, "name": "beauty_salon", "search": "beauty salon" },
 { "id": 11, "name": "bicycle_store", "search": "bicycle store" },
 { "id": 12, "name": "book_store", "search": "book store" },
 { "id": 13, "name": "bowling_alley", "search": "bowling alley" },
 { "id": 14, "name": "bus_station", "search": "bus station" },
 { "id": 15, "name": "cafe", "search": "cafe" },
 { "id": 16, "name": "campground", "search": "campground" },
 { "id": 17, "name": "car_dealer", "search": "car dealer" },
 { "id": 18, "name": "car_rental", "search": "car rental" },
 { "id": 19, "name": "car_repair", "search": "car repair" },
 { "id": 20, "name": "car_wash", "search": "car wash" },
 { "id": 21, "name": "casino", "search": "casino" },
 { "id": 22, "name": "cemetery", "search": "cemetery" },
 { "id": 23, "name": "church", "search": "church" },
 { "id": 24, "name": "city_hall", "search": "city hall" },
 { "id": 25, "name": "clothing_store", "search": "clothing store" },
 { "id": 26, "name": "convenience_store", "search": "convenience store" },
 { "id": 27, "name": "courthouse", "search": "courthouse" },
 { "id": 28, "name": "dentist", "search": "dentist" },
 { "id": 29, "name": "department_store", "search": "department store" },
 { "id": 30, "name": "doctor", "search": "doctor" },
 { "id": 31, "name": "electrician", "search": "electrician" },
 { "id": 32, "name": "electronics_store", "search": "electronics store" },
 { "id": 33, "name": "embassy", "search": "embassy" },
 { "id": 34, "name": "fire_station", "search": "fire station" },
 { "id": 35, "name": "florist", "search": "florist" },
 { "id": 36, "name": "funeral_home", "search": "funeral home" },
 { "id": 37, "name": "furniture_store", "search": "furniture store" },
 { "id": 38, "name": "gas_station", "search": "gas station" },
 { "id": 39, "name": "grocery_or_supermarket", "search": "grocery or supermarket" },
 { "id": 40, "name": "gym", "search": "gym" },
 { "id": 41, "name": "hair_care", "search": "hair care" },
 { "id": 42, "name": "hardware_store", "search": "hardware store" },
 { "id": 43, "name": "hindu_temple", "search": "hindu temple" },
 { "id": 44, "name": "home_goods_store", "search": "home goods store" },
 { "id": 45, "name": "hospital", "search": "hospital" },
 { "id": 46, "name": "insurance_agency", "search": "insurance agency" },
 { "id": 47, "name": "jewelry_store", "search": "jewelry store" },
 { "id": 48, "name": "laundry", "search": "laundry" },
 { "id": 49, "name": "lawyer", "search": "lawyer" },
 { "id": 50, "name": "library", "search": "library" },
 { "id": 51, "name": "liquor_store", "search": "liquor store" },
 { "id": 52, "name": "local_government_office", "search": "local government office" },
 { "id": 53, "name": "locksmith", "search": "locksmith" },
 { "id": 54, "name": "lodging", "search": "lodging" },
 { "id": 55, "name": "meal_delivery", "search": "meal delivery" },
 { "id": 56, "name": "meal_takeaway", "search": "meal takeaway" },
 { "id": 57, "name": "mosque", "search": "mosque" },
 { "id": 58, "name": "movie_rental", "search": "movie rental" },
 { "id": 59, "name": "movie_theater", "search": "movie theater" },
 { "id": 60, "name": "moving_company", "search": "moving company" },
 { "id": 61, "name": "museum", "search": "museum" },
 { "id": 62, "name": "night_club", "search": "night club" },
 { "id": 63, "name": "painter", "search": "painter" },
 { "id": 64, "name": "park", "search": "park" },
 { "id": 65, "name": "parking", "search": "parking" },
 { "id": 66, "name": "pet_store", "search": "pet store" },
 { "id": 67, "name": "pharmacy", "search": "pharmacy" },
 { "id": 68, "name": "physiotherapist", "search": "physiotherapist" },
 { "id": 69, "name": "plumber", "search": "plumber" },
 { "id": 70, "name": "police", "search": "police" },
 { "id": 71, "name": "post_office", "search": "post office" },
 { "id": 72, "name": "real_estate_agency", "search": "real estate agency" },
 { "id": 73, "name": "restaurant", "search": "restaurant" },
 { "id": 74, "name": "roofing_contractor", "search": "roofing contractor" },
 { "id": 75, "name": "rv_park", "search": "rv park" },
 { "id": 76, "name": "school", "search": "school" },
 { "id": 77, "name": "shoe_store", "search": "shoe store" },
 { "id": 78, "name": "shopping_mall", "search": "shopping mall" },
 { "id": 79, "name": "spa", "search": "spa" },
 { "id": 80, "name": "stadium", "search": "stadium" },
 { "id": 81, "name": "storage", "search": "storage" },
 { "id": 82, "name": "store", "search": "store" },
 { "id": 83, "name": "subway_station", "search": "subway station" },
 { "id": 84, "name": "synagogue", "search": "synagogue" },
 { "id": 85, "name": "taxi_stand", "search": "taxi stand" },
 { "id": 86, "name": "train_station", "search": "train station" },
 { "id": 87, "name": "transit_station", "search": "transit station" },
 { "id": 88, "name": "travel_agency", "search": "travel agency" },
 { "id": 89, "name": "university", "search": "university" },
 { "id": 90, "name": "veterinary_care", "search": "veterinary care" },
 { "id": 91, "name": "zoo", "search": "zoo" }


         ],


    everlive: {
        appId: '3t5oa8il0d0y02eq', // Put your Backend Services API key here
        scheme: 'http'
    },
    views: {
        init: 'index.html',
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
