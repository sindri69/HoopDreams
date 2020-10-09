const pickupGameMutations = require('./PickupGameMutations')
const playerMutations = require('./PlayerMutations')

module.exports = `
    type Mutation {
        ${pickupGameMutations}
        ${playerMutations}
    }
`