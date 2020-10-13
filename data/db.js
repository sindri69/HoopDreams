const mongoose = require('mongoose');
const playerSchema = require('./schema/Player');
const pickupGameSchema = require('./schema/PickupGame');

const connection = mongoose.createConnection('mongodb+srv://hehehehehe:ch4c8ptqyPDBLKqN@cluster0.3obn8.mongodb.net/<auctionhouse>?retryWrites=true&w=majority', { useNewUrlParser: true });

module.exports = {
    Player: connection.model('Players', playerSchema),
    PickupGame: connection.model('PickupGames', pickupGameSchema),
};
