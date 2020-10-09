module.exports = `
    createPickupGame(input: PickupGameInput!): PickupGame!
    removePickupGame(id: String!): Boolean!
    addPlayerToPickupGame(id: String! registeredPlayers: [Player!]!): PickupGame!
    removePlayerFromPickupGame(id: String! registeredPlayer: [Player!]! ): Boolean!
`
