const basketballField = require("../data/schema/basketballField");
const { BasketballFieldClosedError, NotFoundError, PickupGameExceedMaximumError, PickupGameAlreadyPassedError, PickupGameOverlapError } = require("../errors");

module.exports = {
    queries: {
        allPickupGames: async(parent, args, context) => {
            const {basketballFieldService} = context.services
            const myDB = context.db
            const pickupgames = await myDB.PickupGame.find({available: true})
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
            const {basketballFieldService} = context.services
            const myDB = context.db
            const game = await myDB.PickupGame.findById(args.id)

            const location = await basketballFieldService.getBasketballfieldById(game.location, context);
            const host = await myDB.Player.findById(game.host)

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
            
            all_games = await myDB.PickupGame.find({location: basketballfieldId})
            for (i = 0; i < all_games.length; i++){
                if (date_start <= all_games[i].start && all_games[i].start <= date_end) throw new PickupGameOverlapError(); // b starts in a
                if (date_start <= all_games[i].end   && all_games[i].end   <= date_end) throw new PickupGameOverlapError(); // b ends in a
                if (all_games[i].start <  date_start && date_end   <  all_games[i].end) throw new PickupGameOverlapError(); // a in b
            }

            
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
            const { id } = args;
            const { myDB } = context;
            const result = await myDB.PickupGame.findById({_id: id});
            if(result == null) {throw new Error('Could not delete pickup game');}
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
            const {basketballFieldService} = context.services;
            const myDB = context.db
            const { id, playerId} = args;
            const pickupgame = await myDB.PickupGame.findOne({_id: id, available: true});
            const capacity = await basketballFieldService.getBasketballfieldById(pickupgame.location, context).capacity;
            const overlappingGames = await myDB.PickupGame.find({start: {$gte: pickupgame.start}, end: {$lte: pickupgame.end}, location: pickupgame.location})
            if(pickupgame == undefined) {throw new NotFoundError();}
            
            //check if playerid exists
            const Player = await myDB.Player.findOne({_id: playerId, available: true});
            if(Player == undefined) {throw new NotFoundError('skrifa message fyrir yðar hátign');}


            if (pickupgame.registeredPlayers.length == capacity){throw new PickupGameExceedMaximumError()}

            for (i = 0; i < pickupgame.registeredPlayers.length; i++){
                if (pickupgame.registeredPlayers[i] == Player){throw new Error('This player is already in this game')}
            }

            for (i = 0; i < overlappingGames.length; i++){
                for (j = 0; j < overlappingGames[i].registeredPlayers.length; j++){
                    if (overlappingGames[i].registeredPlayers[j] == Player){
                        throw new Error('This player is busy at that time')
                    }
                }
            } 
            Player.playedGames.push(pickupgame.id)
            Player.save()
            console.log(pickupgame.registeredPlayers)
            pickupgame.registeredPlayers.push(Player)
            pickupgame.save()
            returned = {"id": return_value._id, "start": return_value["start"], "end": return_value["end"], "location": {"id": location.id, "name": location.name, "capacity": location.capacity, "yearOfCreation": location.yearOfCreation, "status": location.status}, "host": {"id": host._id, "name": host.name}, "registeredPlayers": [{"id": host._id, "name": host.name}]}
            return pickupgame
        },
        removePlayerFromPickupGame: async (parent, args, context) => {
            const {myDB} = context;
            const { player, pickupgame} = args.input;
            const Pickupgame = await myDB.PickupGame.findById(pickupgame);
            if(Pickupgame == undefined) {throw new NotFoundError();}
            
            //check if playerid exists
            const Player = await myDB.Player.findbyId(player);
            if(Player == undefined) {throw new NotFoundError('skrifa message fyrir yðar hátign');}

            if (Pickupgame.end < Date.now()){throw new PickupGameAlreadyPassedError()}
            
            for (i = 0; i < player.playedGames.length; i++){
                if (player.playedGames[i] == pickupgame.id){
                    player.playedGames.splice(i)
                }
            }
            player.save()

            for (i = 0; i < Pickupgame.registeredPlayers.length; i++){
                if (Pickupgame.registeredPlayers[i] == player){
                    Pickupgame.registeredPlayers.splice(i)
                    if (player == Pickupgame.host){
                        var sorted = Pickupgame.registeredPlayers.sort()
                        Pickupgame.host = sorted[0]
                        Pickupgame.save()
                        return Pickupgame
                    }
                }
            }

            throw new Error('This player is not in this game')
        }
    }
};