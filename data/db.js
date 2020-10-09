const mongoose = require('mongoose');
//const artSchema = require('../schemas/art');
//const artistSchema = require('../schemas/artist');
//const auctionSchema = require('../schemas/auction');
//const auctionBidSchema = require('../schemas/auctionBid');
//const customerSchema = require('../schemas/customer');

const connection = mongoose.createConnection('mongodb+srv://hehehehehe:ch4c8ptqyPDBLKqN@cluster0.3obn8.mongodb.net/<auctionhouse>?retryWrites=true&w=majority', { useNewUrlParser: true });

module.exports = {
    //Art: connection.model('Art', artSchema),
    //Artist: connection.model('Artist', artistSchema),
    //Auction: connection.model('Auction', auctionSchema),
    //AuctionBid: connection.model('AuctionBid', auctionBidSchema),
    //Customer: connection.model('Customer', customerSchema)
};
