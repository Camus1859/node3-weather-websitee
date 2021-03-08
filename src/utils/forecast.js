const request = require('request');

const forecast = (latitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=10891d32884a90b93c6f6c27dd465c36&query=${latitude},${longitude}&units=f`;

  request({ url: url, json: true }, (error, response) => {
    if (error) {
      callback('Unable to connect to weather services', undefined);
    } else if (response.body.error) {
      callback('Unable to find location, try another search', undefined);
    } else {
      callback(undefined, response.body.current.weather_descriptions[0]);
    }
  });
};

module.exports = forecast;
