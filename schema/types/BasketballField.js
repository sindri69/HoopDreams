module.exports = `
  type BasketballField {
    id: ID!
    name: String!
    capacity: Int!
    yearOfCreation: String!
    pickupGames: [PickupGame!]!
    status: BasketballFieldStatus!
  }
`;