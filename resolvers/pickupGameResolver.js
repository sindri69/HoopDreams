const { BasketballFieldClosedError, NotFoundError, PickupGameExceedMaximumError, PickupGameAlreadyPassedError } = require("../errors");

module.exports = {
    queries: {
        allPickupGames: async(parent, args, context) => {
            const myDB = context.db
            const pickupgames = await myDB.PickupGame.find({available: true})
            console.log(pickupgames)
            return pickupgames
    }},
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

            if (new Date(end).getTime() - new Date(start).getTime() > 300000*24) {throw new Error('This game is too long')} 
            if (new Date(end).getTime() - new Date(start).getTime() < 300000){throw new Error('This game is too short')}

            

            //check if field is closed
            if (field.status === 'CLOSED') {
                throw new BasketballFieldClosedError();
            }
            console.log(basketballfieldId)
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

            console.log(value)

            return_value = value
            return_value["id"] = return_value["_id"]
            delete return_value["_id"]
            return_value["location"] = await basketballFieldService.getBasketballfieldById(basketballfieldId, context);
            return_value["host"] = await myDB.Player.findById(hostId)
            console.log(return_value["host"])
            return_value["registeredPlayers"] = JSON.parse(return_value["host"])

            
            console.log(return_value)
            hostobject.playedGames = value._id
            hostobject.save()
            return return_value;
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
            const {myDB, basketballService} = context;
            const { player, pickupgame} = args.input;
            const Pickupgame = await myDB.PickupGame.find({_id: pickupgame, available: true});
            const capacity = await basketballService.getBasketballfieldById(pickupgame.location).capacity;
            const overlapingGames = await myDB.PickupGame.find({start: {$gte: pickupgame.start}, end: {$lte: pickupgame.end}, location: pickupgame.location})
            if(pickupgame == undefined) {throw new NotFoundError();}
            
            //check if playerid exists
            const Player = await myDB.Player.find({_id: player, available: true});
            if(Player == undefined) {throw new NotFoundError('skrifa message fyrir yðar hátign');}

            if (Pickupgame.registeredPlayers.length == capacity){throw new PickupGameExceedMaximumError()}

            for (i = 0; i < Pickupgame.registeredPlayers.length; i++){
                if (Pickupgame.registeredPlayers[i] == player){throw new Error('This player is already in this game')}
            }

            for (i = 0; i < overlapingGames.length; i++){
                for (j = 0; j < overlappingGames[i].registeredPlayers.length; j++){
                    if (overlapingGames[i].registeredPlayers[j] == player){
                        throw new Error('This player is busy at that time')
                    }
                }
            } 
            player.playedGames.push(pickupgame.id)
            player.save()
            Pickupgame.registeredPlayers.push(player)
            Pickupgame.save()
            return Pickupgame
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