const request = require('request');

const basketballfieldService = () => {

  //get all basketballfields
  const getAllBasketballfields = () => request('https://basketball-fields.herokuapp.com/api/basketball-fields', function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body);
    return response; 
  });


  //get basketballfields by id
  const getBasketballfieldById = (id) => request('https://basketball-fields.herokuapp.com/api/basketball-fields/'.concat(id), function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    console.log('body:', body); 
    return response;
  });


  return {
    getAllBasketballfields,
    getBasketballfieldById
  };

};

module.exports = basketballfieldService();