const request = require('request');
const Url = 'https://basketball-fields.herokuapp.com/api/basketball-fields';

const basketballfieldService = {

    getAllBasketballfields: (status, context) => new Promise((resolve, reject) => {
        const query = status ? `?status=${status}` : '';

        request.get(`${Url}${query}`, (err, response, body) => {
            if (err) {reject();}
            const myDB = context.db
            body = JSON.parse(body)
            for (i = 0; i < body.length; i++){
                body[i]["pickupGames"] = myDB.BasketballField.find({stringId: body[i]["id"]})
            }
            resolve(body);
        });
    }),

    getBasketballfieldById: (id,context) => new Promise((resolve, reject) => {
        return request.get(`${Url}/${id}`, (err, response, body) => {
          if (err) {reject(); }
          const myDB = context.db
          body = JSON.parse(body)
          body["pickupGames"] = myDB.BasketballField.find({stringId: body["id"]})
          resolve((body));
        });
    })
};

module.exports = basketballfieldService;
















// const basketballfieldService = () => {

//   //get all basketballfields
//   const getAllBasketballfields = () => request('https://basketball-fields.herokuapp.com/api/basketball-fields', function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body);
//     return response;
//   });


//   //get basketballfields by id
//   const getBasketballfieldById = (id) => request('https://basketball-fields.herokuapp.com/api/basketball-fields/'.concat(id), function (error, response, body) {
//     console.error('error:', error); // Print the error if one occurred
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', body);
//     return response;
//   });


//   return {
//     getAllBasketballfields,
//     getBasketballfieldById
//   };

// };

// module.exports = basketballfieldService();
