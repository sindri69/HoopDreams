module.exports = `
    createPickupGame(input: PickupGameInput!): PickupGame!
    removePickupGame(id: String!): Boolean!
    addPlayerToPickupGame(id: String! playerId: String!): PickupGame!
    removePlayerFromPickupGame(id: String! playerId: String! ): Boolean!
`
