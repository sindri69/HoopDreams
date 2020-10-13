const { GraphQLScalarType } = require('graphql');
const moment = require('moment');

module.exports = {
    Moment: new GraphQLScalarType({
        name: 'Moment',
        description: 'a custom scalar for representing dates',
        parseValue: value => new Date(value).toString(),
        parseLiteral: val => val.value,
        serialize: value => moment(new Date(value)).format('llll')
    })
};