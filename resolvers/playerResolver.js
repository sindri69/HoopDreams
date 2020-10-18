const { NotFoundError } = require("../errors")
const ObjectId = require ("mongoose").Types.ObjectId

module.exports = {
    queries: {
        allPlayers: async(parent, args, context) => {
            const myDB = context.db;
            const { basketballFieldService } = context.services;
            const players = await myDB.Player.find({available: true})
            final=[]
            for (i = 0; i < players.length; i++){
                all_games = []
                for (c = 0; c < players[i].playedGames.length; c++){ //id, start, end, location (id, name, capacity, yearofcretion, status) registeredPlayers(id, name), host{id, name}
                    game = await myDB.PickupGame.findOne({_id: players[i].playedGames[c]})
                    location = JSON.parse(await basketballFieldService.getBasketballfieldById(game.location, context))
                    host = await myDB.Player.findOne({_id: game.host})
                    played_game = {"id": game._id, "start": game.start, "end": game.end, "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}}

                    all_games.push(played_game)
                }
                final_value = {"id": players[i]._id, "name": players[i].name, "playedGames": all_games}
                final.push(final_value)
            }
            return final
        }, 
        player: async(parent, args, context) => {
            const {basketballFieldService} = context.services
            const myDB = context.db;
            const {id} = args

            if (!ObjectId.isValid(id)) throw new NotFoundError('This id is not valid')

            const player = await myDB.Player.findOne({_id: id, available: true},function(err,result){
                if (err) {console.log(err); return null}
                else return result;
            })
            console.log(player)
            if (player == null) {throw new NotFoundError('This player does not exist')}
            all_games = []
            for (i = 0; i< player.playedGames.length; i++){
                game = await myDB.PickupGame.findOne({_id: player.playedGames[i]})
                location = JSON.parse(await basketballFieldService.getBasketballfieldById(game.location, context))
                host = await myDB.Player.findOne({_id: game.host})
                played_game = {"id": game._id, "start": game.start, "end": game.end, "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}}
                all_games.push(played_game)
            }
            final = {"id": player._id, "name": player.name, "playedGames": all_games}
            return final
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
            const {basketballFieldService} = context.services
            const result = await myDB.Player.findOneAndUpdate({_id: id, available: true}, {name: name}, {
                new: true
            })
            if (result == null) throw new NotFoundError('This player cannot be updated since he does not exist')
            all_games = []
            for (i = 0; i< result.playedGames.length; i++){
                game = await myDB.PickupGame.findOne({_id: result.playedGames[i]})
                location = JSON.parse(await basketballFieldService.getBasketballfieldById(game.location, context))
                host = await myDB.Player.findOne({_id: game.host})
                played_game = {"id": game._id, "start": game.start, "end": game.end, "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}}
                all_games.push(played_game)
            }
            final = {"id": result._id, "name": result.name, "playedGames": all_games}
            return final
        }

    }
}