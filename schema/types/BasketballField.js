module.exports = `
  type BasketballField {
    id: ID!
    name: String!
    capacity: Int!
   
    pickupGames: [PickupGame!]!
    status: BasketballFieldStatus!
  }
`;
//yearOfCreation: Moment!