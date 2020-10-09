module.exports = `
  createPlayer(input: PlayerInput!): Player!
  updatePlayer(id: String! playedGames: [PickupGame!]!): Player!
  deletePlayer(id: String!): Boolean!
`;