// • (5%) createPlayer - Create a player and returns the newly created player matching
// the Player type
// • (5%) updatePlayer - Updates a player by id and returns the updated player matching
// the Player type
// • (5%) removePlayer - Marks a player as deleted and returns either true or an error if
// something happened


const { NotFoundError } = require("../errors")

module.exports = {
    queries: {
        allPlayers: async(context) => {
            const {myDB} = context
            const players = await myDB.Players.find({available: true})
            return players
        }, //Ekki rétt. Geri þetta betur þegar við vitum hvernig db lítur út
        player: async(parent, args, context) => {
            const {myDB} = context
            const {id} = args
            const player = await myDB.Players.find({_id: id, available: true})
            if (player == undefined) {throw new NotFoundError('This player is not valid')}
            return player
        }},
    mutations: {
        createPlayer: async (parent, args, context) => {
            const { name } = args.input;
            const { myDB } = context;

            return myDB.Player.create({
                name, 
                playedGames: []
            });
        },

        removePlayer: async (parent, args, context) => {
            const { id } = args;
            const { myDB } = context;
            const result = await myDB.Players.findById({_id: id});
            if(result == null) {throw new NotFoundError('This player does not exist');}
            result.available = false
            result.save()
            return true;
        },

        updatePlayer: async(parent, args, context) => {
            const {id, pickupgame, name} = args;
            const {myDB} = context;
            const result = await myDB.Players.find({_id: id, available: true})
            //Hvað erum við að uppfæra
        }

    }
}