module.exports = `
  type PickupGame {
    id: ID!
    start: String!
    end: String!
    location: BasketballField!
    registeredPlayers: [Player!]!
    host: Player!
  }
`;
