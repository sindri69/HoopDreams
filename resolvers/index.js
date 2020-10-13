const PickupGameResolver = require('./pickupGameResolver');
const PlayerResolver = require('./playerResolver');
const CustomScalarResolver = require('./customScalarResolver');
const BasketballFieldResolver = require('./basketballFieldResolver');

module.exports = {
  Query: {
    ...PickupGameResolver.queries,
    // ...enemyResolver.queries,
    // ...levelResolver.queries
  },
  Mutation: {
    ...PickupGameResolver.mutations
  },
  ...CustomScalarResolver
  // ...enemyResolver.types
};
