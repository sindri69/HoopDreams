const { player } = require('../data/db').player;

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
        allPlayers: (context) => context.db.Player.find({}), //Ekki rétt. Geri þetta betur þegar við vitum hvernig db lítur út
        player: (parent, args, context) => {
            return context.db.player.findOne({_id:args.id})
        }
    },


}