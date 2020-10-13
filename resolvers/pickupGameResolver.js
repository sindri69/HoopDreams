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

const { BasketballFieldClosedError, NotFoundError, PickupGameExceedMaximumError, PickupGameAlreadyPassedError } = require("../errors");

module.exports = {
    queries: {
        allPickupGames: async(context) => {
            const {myDB} = context
            const pickupgames = await myDB.PickupGame.find({})
            return pickupgames
    }},
    mutations: {
        createPickupGame: async (parent, args, context) => {
            const { start, end, basketballFieldId, host } = args.input;
            const { myDB, basketballService } = context;
            const field = await basketballService.getBasketballfieldById(basketballFieldId);

            if (field == undefined) { throw new Error('Basketballfield does not exist'); }

            //check if field is closed
            if (field.status === 'CLOSED') {
                throw new BasketballFieldClosedError();
            }

            return myDB.PickupGame.create({
                start, end, host,
                location: basketballFieldId,
                registeredPlayers: [host]
            });
        },

        removePickupGame: async (parent, args, context) => {
            const { id } = args;
            const { myDB } = context;
            const result = await myDB.PickupGame.deleteOne({ _id: id });
            if(!result.ok) {throw new Error('Could not delete pickup game');}
            return true;
        },

        addPlayerToPickupGame: async (parent, args, context) => {
            const {myDB, basketballService} = context;
            const { player, pickupgame} = args.input;
            const Pickupgame = await myDB.PickupGame.findById(pickupgame);
            const capacity = await basketballService.getBasketballfieldById(pickupgame.location).capacity;
            const overlapingGames = await myDB.PickupGame.find({start: {$gte: pickupgame.start}, end: {$lte: pickupgame.end}, location: pickupgame.location})
            if(pickupgame == undefined) {throw new NotFoundError();}
            
            //check if playerid exists
            const Player = await myDB.Player.findbyId(player);
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