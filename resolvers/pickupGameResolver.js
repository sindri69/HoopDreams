const basketballField = require("../data/schema/basketballField");
const { BasketballFieldClosedError, NotFoundError, PickupGameExceedMaximumError, PickupGameAlreadyPassedError, PickupGameOverlapError, PlayerConflictError, DeletePickupGameError } = require("../errors");
const playerResolver = require("./playerResolver");

module.exports = {
    queries: {
        allPickupGames: async(parent, args, context) => {
            //get everything we need
            const {basketballFieldService} = context.services
            const myDB = context.db
            const pickupgames = await myDB.PickupGame.find({available: true})

            //change the data so it can be returned in the correct format
            all_games = []
            for (c = 0; c < pickupgames.length; c++){
                game = pickupgames[c]
                var location = await basketballFieldService.getBasketballfieldById(game.location, context)
                var host = await myDB.Player.findById(game.host)
                registered_players = []
                for (i = 0; i < game.registeredPlayers.length; i++){
                player = await myDB.Player.findById(game.registeredPlayers[i])
                registered_players.push(player)
                }
                returned = {"id": game._id, "start": game.start, "end": game.end, "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}, "registeredPlayers": registered_players}
                all_games.push(returned)
            }
            return all_games
        },
        pickupGame: async(parent, args, context) => {
            //get everything we need
            const {basketballFieldService} = context.services
            const myDB = context.db
            const game = await myDB.PickupGame.findById(args.id)
            const location = await basketballFieldService.getBasketballfieldById(game.location, context);
            const host = await myDB.Player.findById(game.host)

            //change the data so it can be returned in the correct format
            registered_players = []
            for (c = 0; c < game.registeredPlayers.length; c++){
                player = await myDB.Player.findById(game.registeredPlayers[c])
                registered_players.push(player)
            }
            returned = {"id": game._id, "start": game.start, "end": game.end, "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}, "registeredPlayers": registered_players}
            return returned
        }
    },
    mutations: {
        createPickupGame: async (parent, args, context) => {
            //get everything we need
            const { start, end, basketballfieldId, hostId} = args.input;
            const { basketballFieldService } = context.services;
            const myDB = context.db
            
            //find the basketballfield and host
            const field = await basketballFieldService.getBasketballfieldById(basketballfieldId, context);
            const hostobject = await myDB.Player.findOne({_id: hostId, available: true})
            if (field == undefined) { throw new Error('Basketballfield does not exist'); }
            if (hostobject == null) {throw new NotFoundError('The host is not a valid player')}


            //Check if the dates are valid
            date_end = new Date(end)
            date_start = new Date(start)

            if (date_end < Date.now() || date_start < Date.now()){throw new Error('This date has passed')}
            if (date_end < date_start){throw new Error('The end cannot happen before the beginning unless you`re a time traveler')}
            if (date_end.getTime() - date_start.getTime() > 300000*24) {throw new Error('This game is too long')} 
            
            if (date_end.getTime() - date_start.getTime() < 300000){throw new Error('This game is too short')}
            
            //check if field is closed
            if (field.status === 'CLOSED') {
                throw new BasketballFieldClosedError();
            }
            
            //check again if dates are valid
            all_games = await myDB.PickupGame.find({location: basketballfieldId})
            for (i = 0; i < all_games.length; i++){
                if (date_start <= all_games[i].start && all_games[i].start <= date_end) throw new PickupGameOverlapError(); // b starts in a
                if (date_start <= all_games[i].end   && all_games[i].end   <= date_end) throw new PickupGameOverlapError(); // b ends in a
                if (all_games[i].start <  date_start && date_end   <  all_games[i].end) throw new PickupGameOverlapError(); // a in b
            }

            //change the data so it can be returned in the correct format
            value = await myDB.PickupGame.create({
                start, end, location: basketballfieldId,
                host: hostId,
                registeredPlayers: [hostId]
            });

            const basketballfield = await myDB.BasketballField.findOne({stringID: basketballfieldId});
            if (basketballfield == null) {
                myDB.BasketballField.create({
                    _id:basketballfieldId,
                    stringID: basketballfieldId,
                    pickupGames: [value._id]
                })
            }
            else {
            basketballfield.pickupGames.push(value._id)
            basketballfield.save()
            }

            let return_value = value
            const location = await basketballFieldService.getBasketballfieldById(basketballfieldId, context);
            const host = await myDB.Player.findById(hostId)

            returned = {"id": return_value._id, "start": return_value["start"], "end": return_value["end"], "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}, "registeredPlayers": [{"id": host._id, "name": host.name}]}

            hostobject.playedGames = value._id
            hostobject.save()
            return returned
            },

        removePickupGame: async (parent, args, context) => {
            //get everything we need
            const { id } = args;
            const { myDB } = context;
            const result = await myDB.PickupGame.findById({_id: id});
            
            if(result == null) {throw new DeletePickupGameError('Could not delete pickup game');}
            result.available = false
            result.save()
            basketballfield = myDB.BasketballField.findById(basketballFieldId);
            for (i = 0; i <basketballfield["pickupGames"].length; i++){
                if (basketballfield["pickupGames"][i] == id){
                    basketballfield["pickupGames"].splice(i)
                    break
                }
            }
            return true;
        },

        addPlayerToPickupGame: async (parent, args, context) => {
            //get everything we need
            const {basketballFieldService} = context.services;
            const myDB = context.db
            const { id, playerId} = args;
            const pickupgame = await myDB.PickupGame.findOne({_id: id, available: true});
            const location = await basketballFieldService.getBasketballfieldById(pickupgame.location, context);
            const capacity = location.capacity
            const overlappingGames = await myDB.PickupGame.find({start: {$gte: pickupgame.start}, end: {$lte: pickupgame.end}})
            
            if(pickupgame == undefined) {throw new NotFoundError();}


            //check if playerid exists
            const Player = await myDB.Player.findOne({_id: playerId, available: true});
            if(Player == undefined) {throw new NotFoundError('Player was not found');}

            //check if pickupgame is full
            if (pickupgame.registeredPlayers.length == capacity){throw new PickupGameExceedMaximumError()}

            //check if player is already in the game
            for (i = 0; i < pickupgame.registeredPlayers.length; i++){
                if (pickupgame.registeredPlayers[i] == Player._id){throw new PlayerConflictError('This player is already in this game')}
            }

            //check if player is in another game at the same time
            for (i = 0; i < overlappingGames.length; i++){
                for (j = 0; j < overlappingGames[i].registeredPlayers.length; j++){
                    if (overlappingGames[i].registeredPlayers[j] == Player._id){
                        throw new PlayerConflictError('This player is busy at that time')
                    }
                }
            } 
            Player.playedGames.push(pickupgame._id)
            Player.save()
            pickupgame.registeredPlayers.push(Player._id)
            pickupgame.save()

            //make the return object
            const host = await myDB.Player.findOne({_id: pickupgame.host})

            registered_players = []
            for (c = 0; c < pickupgame.registeredPlayers.length; c++){
                player = await myDB.Player.findById(pickupgame.registeredPlayers[c])
                registered_players.push(player)
            }

            returned = {"id": pickupgame._id, "start": pickupgame.start, "end": pickupgame.end, "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}, "registeredPlayers": [{"id": host._id, "name": host.name}]}
            return returned
        },
        removePlayerFromPickupGame: async (parent, args, context) => {
            //get everything we need
            const myDB = context.db;
            const { id, playerId} = args;
            const Pickupgame = await myDB.PickupGame.findById(id);
            if(Pickupgame == undefined) {throw new NotFoundError('could not find pickup game with this id');}
            
            //check if playerid exists
            const Player = await myDB.Player.findById(playerId);
            if(Player == undefined) {throw new NotFoundError('cound not find player with this id');}

            //check if game is already over
            if (Pickupgame.end < Date.now()){throw new PickupGameAlreadyPassedError('this pickup game is already over so a player cannot be removed')}
            
            for (i = 0; i < Player.playedGames.length; i++){
                if (Player.playedGames[i] == Pickupgame.id){
                    Player.playedGames.splice(i)
                }
            }
            Player.save()



            //make the return object
            for (i = 0; i < Pickupgame.registeredPlayers.length; i++){
                if (Pickupgame.registeredPlayers[i] == playerId){
                    Pickupgame.registeredPlayers.splice(i, 1)
               
                    //check if the player to be removed is the host,if so make the first player in the alphabet be the new host
                    if (playerId == Pickupgame.host){           
                        var tmp = []
                        for(j = 0; j < Pickupgame.registeredPlayers.length; j++){
                            tmpplayer = await myDB.Player.findById(Pickupgame.registeredPlayers[j]);
                            tmp.push(tmpplayer.name) 
                        }
                        newhostname = tmp.sort()[0]
                        const newhost = await myDB.Player.findOne({name: newhostname});
                        Pickupgame.host = newhost._id
                    }
                    Pickupgame.save()
                    return true
                }
            }

            throw new Error('This player is not in this game')
        }
    }
};