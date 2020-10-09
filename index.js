const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema'); //setup later (schema) 
const resolvers = {}; //setup later (resolvers)

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen()
    .then(({ url }) => console.log(`GraphQL Service is running on ${ url }`));
