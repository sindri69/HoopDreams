const Schema = require('mongoose').Schema;

module.exports = new Schema({
    name: {type: String, required: true},
    playedGames: [String],
    available: {type: Boolean, default: true}
});