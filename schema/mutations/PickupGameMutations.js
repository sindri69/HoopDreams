module.exports = `
    createPickupGame(input: PickupGameInput!): PickupGame!
    removePickupGame(id: String!): Boolean!
    addPlayerToPickupGame(id: String! registeredPlayers: PlayerInput!): PickupGame!
    removePlayerFromPickupGame(id: String! registeredPlayer: PlayerInput! ): Boolean!
`
