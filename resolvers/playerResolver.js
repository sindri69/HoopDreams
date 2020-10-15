const { NotFoundError } = require("../errors")

module.exports = {
    queries: {
        allPlayers: async(context) => {
            console.log(context)
            const myDB = context.db;
            const players = await myDB.Players.find({available: true})
            return players
        }, //Ekki rétt. Geri þetta betur þegar við vitum hvernig db lítur út
        player: async(parent, args, context) => {
            console.log(context)
            const myDB = context.db;
            const {id} = args
            const player = await myDB.Players.find({_id: id, available: true})
            if (player == undefined) {throw new NotFoundError('This player is not valid')}
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
            const result = await myDB.Players.findById({_id: id});
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