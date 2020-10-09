import moment from 'moment';

module.exports = `
  type Moment {
    id: ID!
    name: String!
    capacity: Int!
    yearOfCreation: Moment!
    pickupGames: [PickupGame!]!
    status: BasketBallFieldStatus!
  }
`;

//moment().format('llll');
//moment tutorial https://flaviocopes.com/momentjs/
//https://www.apollographql.com/docs/apollo-server/schema/scalars-enums/
