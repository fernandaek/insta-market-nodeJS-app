const NodeGeocoder = require('node-geocoder');
const options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: 
};
const geocoder = NodeGeocoder(options);

module.exports = geocoder;