require('dotenv').config()
var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
var { makeExecutableSchema } = require('graphql-tools');
var { ApolloEngine } = require('apollo-engine');
var bodyParser = require('body-parser');
var cors = require('cors');
var db = require('./mysql_connection')
var jwt = require('jsonwebtoken');

const PORT = process.env.PORT || 3000 // env goes here

//graphql schema 
var schema = require('./graphql/schemas')

const app = express()

const authentication = async(req, db) => {
    //auth jwt token goes here
}

const wrapper = async(req, res,  next) => {
    let userAuth = await authentication(req, db)
    return {
      schema,
      context: {userAuth, db},
      tracing: true,
      cacheControl: true
    }
}

app.use(cors());
// The GraphQL endpoint
app.use('/graphql', bodyParser.json(), graphqlExpress(wrapper));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

// Start the server
app.listen({
  port: process.env.PORT,
  status: console.log('Server run in PORT = ', process.env.PORT)
});