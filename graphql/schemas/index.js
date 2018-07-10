const gqTools = require('graphql-tools');

// Import graphql types
const user = require('./types/user');

//import graphql Resolvers
const resolversFunc = require('../resolvers')

//Query Resolvers
const getUserList = resolversFunc.getUserList.getUserList

//Mutation Mutations
const createNewUser = resolversFunc.createNewUser.createNewUser

//Schema Definitions
const schemaDefinition = `
    type Query {
        getUserList: user
    }

    type Mutation {
        createNewUser(name: String): user
    }
    schema {
        query: Query
        mutation: Mutation
    }
`

module.exports = gqTools.makeExecutableSchema({
    typeDefs: [
        schemaDefinition,
        user
    ],
    resolvers: {
        Query: {
            getUserList
        },
        Mutation: {
            createNewUser
        }
    },
    
})
