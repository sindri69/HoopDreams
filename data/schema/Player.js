const Schema = require('mongoose').Schema;

module.exports = new Schema({
    name: {type: String, required: true},
    playedGames: [Schema.Types.ObjectId],
    available: {type: Boolean, default: true}
});