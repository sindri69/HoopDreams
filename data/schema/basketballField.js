const Schema = require('mongoose').Schema;

module.exports = new Schema({
    _id: {type: String, required: true},
    stringID: {type: String, required: true},
    pickupGames: [String]
});