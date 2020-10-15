const PickupGameResolver = require('./pickupGameResolver');
const PlayerResolver = require('./playerResolver');
const CustomScalarResolver = require('./customScalarResolver');
const BasketballFieldResolver = require('./basketballFieldResolver');

module.exports = {
  Query: {
    ...PickupGameResolver.queries,
    ...BasketballFieldResolver.queries,
    ...PlayerResolver.queries,
  },
  Mutation: {
    ...PickupGameResolver.mutations,
    ...PlayerResolver.mutations
  },
  ...CustomScalarResolver
};
