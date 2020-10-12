const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const basketballfieldService = require('./services');
const myDB = require('./data/db');


const server = new ApolloServer({

    typeDefs,
    resolvers,
    context: {
        db: myDB,
        services: basketballfieldService
    }
    
});

server.listen()
    .then(({ url }) => console.log(`GraphQL Service is running on ${ url }`));
