const request = require('request');
const Url = 'https://basketball-fields.herokuapp.com/api/basketball-fields';

const basketballfieldService = {

    getAllBasketballfields: (status, context) => new Promise((resolve, reject) => {
        const query = status ? `?status=${status}` : '';

        request.get(`${Url}${query}`, async (err, response, body) => {
            if (err) {reject();}
            const myDB = context.db
            console.log("DB", myDB)
            body = JSON.parse(body)
            for (i = 0; i < body.length; i++){
                console.log("ID: ", body[i].id)
                field = await myDB.BasketballField.findOne({stringID: body[i].id})
                console.log(field)
                body[i]["pickupGames"] = field
                console.log(body[i]["pickupGames"])
                if (body[i]["pickupGames"] == undefined){body[i]['pickupGames'] = []}
                else {body[i]['pickupGames'] = field.pickupGames;
                for (j = 0; j < body[i]["pickupGames"].length; j++){
                    body[i]['pickupGames'][j] = await myDB.PickupGame.findOne({_id: body[i]['pickupGames'][j]})
               }}
                
                console.log("body:" ,body[i].id)
                console.log("body:" ,body[i])
            }
            console.log("FINAL ", body)
            resolve(body);
        });
    }),

    getBasketballfieldById: (id,context) => new Promise((resolve, reject) => {
        return request.get(`${Url}/${id}`, (err, response, body) => {
          if (err) {reject(); }
          const myDB = context.db
          body = JSON.parse(body)
          body["pickupGames"] = myDB.BasketballField.find({stringId: body["id"]}).pickupGames
          if (body["pickupGames"] == undefined){body['pickupGames'] = []}
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
