const axios = require('axios');
require('dotenv').config();

const weatherData = async (address, callback) => {
  const url =
    process.env.BASE_URL +
    encodeURIComponent(address) +
    '&APPID=' +
    process.env.SECRET_KEY;
  console.log(url);

  try {
    const response = await axios.get(url);
    callback(response.data);
  } catch (error) {
    callback('Unable to fetch data, Please try again. ' + error.message);
  }
};

module.exports = weatherData;
