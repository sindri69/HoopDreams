const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const myDB = require('./data/db')
const basketballFieldService = require('./services/basketballFieldService')

const server = new ApolloServer({

    typeDefs,
    resolvers,
    context: () => {
      return {
        db: myDB,
        services: {
          basketballFieldService
        }
      }
    }
});

server.listen()
    .then(({ url }) => console.log(`GraphQL Service is running on ${ url }`));
