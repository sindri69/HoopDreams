const { NotFoundError } = require("../errors")

module.exports = {
    queries: {
        allPlayers: async(parent, args, context) => {
            const myDB = context.db;
            const players = await myDB.Player.find({available: true})
            return players
        },
        player: async(parent, args, context) => {
            const myDB = context.db;
            const {id} = args
            const player = await myDB.Player.find({_id: id, available: true}, function(err, result) {
                if(err) {return null}
                console.log(result)
                return result
            });
            if (player == null) {throw new NotFoundError('This player was not available or something')}
            return player
        }},
    mutations: {
        createPlayer: async (parent, args, context) => {
            const { name } = args.input;
            const myDB = context.db;

            return myDB.Player.create({
                name, 
                playedGames: []
            });
        },

        removePlayer: async (parent, args, context) => {
            const { id } = args;
            const myDB  = context.db;
            const result = await myDB.Player.findById({_id: id});
            if(result == null) {throw new NotFoundError('This player does not exist');}
            result.available = false
            result.save()
            return true;
        },

        updatePlayer: async(parent, args, context) => {
            const {id, pickupgame, name} = args;
            const myDB = context.db;
            const result = await myDB.Players.find({_id: id, available: true})
            //Hvað erum við að uppfæra
        }

    }
}