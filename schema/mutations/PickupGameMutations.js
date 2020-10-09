module.exports = `
    createPickupGame(input: PickupGameInput!): PickupGame!
    removePickupGame(id: string!): Boolean!
    addPlayerToPickupGame(id: string! registeredPlayers: [Player!]!): PickupGame!
    removePlayerFromPickupGame(id: string! registeredPlayer: [Player!]! ): Boolean!
`
