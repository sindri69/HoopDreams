const customScalarResolver = require('./customScalarResolver');
const basketballFieldResolver = require('./basketballFieldResolver');
const pickupGameResolver = require('./pickupGameResolver');
const playerResolver = require('./playerResolver');


module.exports = `
  ${customScalarResolver}
  ${basketballFieldResolver}
  ${pickupGameResolver}
  ${playerResolver}
`;