module.exports = `
    type Query {
        allBasketballFields(status: BasketballFieldStatus): [BasketballField!]!
        allPickupGames: [PickupGame!]!
        allPlayers: [Player!]!
        basketballField(id: String!): BasketballField!
        pickupGame(id: String!): PickupGame!
        player(id: String!): Player!
    }
`