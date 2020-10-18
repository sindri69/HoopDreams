const { BasketballFieldClosedError, NotFoundError, PickupGameExceedMaximumError, PickupGameAlreadyPassedError, PickupGameOverlapError, PlayerConflictError } = require("../errors");

module.exports = {
    queries: {
        allBasketballFields: async(parent, args, context) => {
            const { basketballFieldService } = context.services;
            const myDb = context.db
            const { status } = args;
            fields = await basketballFieldService.getAllBasketballfields(status, context);
            final = []
            for (i = 0; i < fields.length; i++){
                field = await myDb.BasketballField.findOne({_id: fields[i].id})
                all_games = []
                for (c=0; c < field.pickupGames.length; c++){

                    game = await myDb.PickupGame.findOne({_id:field.pickupGames[c]})

                    players = []
                    for (x = 0; x < game.registeredPlayers.length; x++){
                        players.push(await myDb.Player.findOne({_id: game.registeredPlayers[x]}))
                    }
                    host = await myDb.Player.findById(game.host)
                    return_game = {"id": game._id, "start": game.start, "end": game.end, "location":{"id": fields[i].id, "name": fields[i].name, "capacity": fields[i].capacity, "yearOfCreation": fields[i].yearOfCreation, "status": fields[i].status}, "registeredPlayers": players, "host": {"id": host._id, "name": host.name}}

                    all_games.push(return_game)
                }
                final_value = {"id": fields[i].id, "name": fields[i].name, "capacity": fields[i].capacity, "yearOfCreation": fields[i].yearOfCreation, "status": fields[i].status, "pickupGames": all_games}

                final.push(final_value)
            }
            return final
    },
        basketballField: async(parent, args, context) => {
            const { basketballFieldService } = context.services;
            const myDb = context.db
            const { id } = args;
            field = await basketballFieldService.getBasketballfieldById(id, context);
            if (field == "Basketball field was not with this id."){throw new NotFoundError('This basketball field does not exist')}
            else {field = JSON.parse(field)}
            location = await myDb.BasketballField.findOne({_id: field.id})
            all_games = []

            for (c = 0; c < location.pickupGames.length; c++){
                game = await myDb.PickupGame.findOne({_id:location.pickupGames[c]})
                players = []
                for (x = 0; x < game.registeredPlayers.length; x++){

                    players.push(await myDb.Player.findOne({_id: game.registeredPlayers[x]}))
                }
                host = await myDb.Player.findById(game.host)
                return_game = {"id": game._id, "start": game.start, "end": game.end, "location":{"id": field.id, "name": field.name, "capacity": field.capacity, "yearOfCreation": field.yearOfCreation, "status": field.status}, "registeredPlayers": players, "host": {"id": host._id, "name": host.name}}
                all_games.push(return_game)
            }
            final_value = {"id": field.id, "name": field.name, "capacity": field.capacity, "yearOfCreation": field.yearOfCreation, "status": field.status, "pickupGames": all_games}

            return final_value
    },
},
}
