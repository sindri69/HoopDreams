module.exports = `
  scalar Moment
  type BasketballField {
    id: ID!
    name: String!
    capacity: Int!
    yearOfCreation: Moment!
    pickupGames: [PickupGame!]!
    status: BasketballFieldStatus!
  }
`;