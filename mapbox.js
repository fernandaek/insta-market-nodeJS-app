var Product = require("../models/product");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({accessToken: 'pk.eyJ1IjoiZmVybmFuZGFlayIsImEiOiJjanprdnhkMTkwbjF5M25xbmt4NnRyNm9uIn0.GW2rIei6wvDHPrth5HzQbw'});




async function geocoder(location) {
try{
	let response = await geocodingClient
		.forwardGeocode({
			query: location,
			limit: 1
		})
	.send();
	console.log(response.body.features[0].geometry.coordinates);
	} catch(err){
		console.log(err.message);
	}
}
geocoder("Alaska, US");
