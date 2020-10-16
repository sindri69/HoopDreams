const { NotFoundError } = require("../errors")
const ObjectId = require ("mongoose").Types.ObjectId

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

            if (!ObjectId.isValid(id)) throw new NotFoundError('This id is not valid')

            const player = await myDB.Player.findOne({_id: id, available: true},function(err,result){
                if (err) {console.log(err); return null}
                else return result;
            })
            console.log(player)
            if (player == null) {throw new NotFoundError('This player does not exist')}
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
            if (!ObjectId.isValid(id)) throw new NotFoundError('This id is not valid')
            const result = await myDB.Player.findOne({_id: id, available:true});
            if(result == null) {throw new NotFoundError('This player does not exist');}
            result.available = false
            result.save()
            return true;
        },

        updatePlayer: async(parent, args, context) => {
            //instructions unclear dick stuck in a blender
            //Only updates name because the functions remove player from a pickupGame and 
            //add player to a pickupgame update the playerGames list automatically
            const {id, name} = args;
            if (!ObjectId.isValid(id)) throw new NotFoundError('This id is not valid')
            const myDB = context.db;
            const result = await myDB.Player.findOneAndUpdate({_id: id, available: true}, {name: name}, {
                new: true
            })
            if (result == null) throw new NotFoundError('This player cannot be updated since he does not exist')
            return result
        }

    }
}