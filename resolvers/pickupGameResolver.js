const pickupgame = require('../data/db').pickupgame;

// (5%) allBasketballFields - Should return a collection of all basketball fields. Contains
// a field argument called status which is of type BasketballFieldStatus (enum) and
// should be used to filter the data based on the status of the basketball field
// • (5%) allPickupGames - Should return a collection of all pickup games
// • (5%) basketballField - Should return a specific basketball field by id
// • (5%) pickupGame - Should return a specific pickup game by id
// (5%) createPickupGame - Creates a pickup game and returns the newly created
// pickup game matching the PickupGame type
// • (5%) createPlayer - Create a player and returns the newly created player matching
// the Player type
// • (5%) updatePlayer - Updates a player by id and returns the updated player matching
// the Player type
// • (5%) removePickupGame - Marks a pickup game as deleted and returns either true
// or an error if something happened
// • (5%) removePlayer - Marks a player as deleted and returns either true or an error if
// something happened
// • (5%) addPlayerToPickupGame - Adds a player to a specific pickup game and
// returns the pickup game matching the PickupGame type
// • (5%) removePlayerFromPickupGame - Removes a player from a specific pickup
// game returns either true or an error if something happened

module.exports = {
    queries: {
        allPickupGames: () => pickupgame // ekki rétt en veit ekki?
    },
    mutation: {...},

}