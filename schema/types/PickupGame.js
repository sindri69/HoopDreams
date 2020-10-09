module.exports = `
  type PickupGame {
    id: ID!

    location: BasketballField!
    registeredPlayers: [Player!]!
    host: Player!
  }
`;
//    start: Moment!
//end: Moment!