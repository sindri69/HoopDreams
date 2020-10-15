const Schema = require('mongoose').Schema;

module.exports = new Schema({
    stringID: {type: String, required: true},
    pickupGames: [String]
});