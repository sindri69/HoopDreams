module.exports = `
  createPlayer(input: PlayerInput!): Player!
  updatePlayer(id: String! playedGames: [PickupGameInput]!): Player!
  deletePlayer(id: String!): Boolean!
`;