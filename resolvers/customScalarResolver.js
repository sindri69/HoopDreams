const { GraphQLScalarType } = require('graphql');
const moment = require('moment');

module.exports = {
    Moment: new GraphQLScalarType({
        name: 'Moment',
        description: 'a custom svalar for representing dates',
        parseValue: value => new Date(value).toString(),
        serialize: value => moment(new Date(value)).format('llll'),
        parseLiteral: ast => ast.value
    })
};