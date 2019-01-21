const gqTools = require('graphql-tools');
const { PubSub, withFilter } = require('graphql-subscriptions');
const pubsub = new PubSub();
const { subscribe } = require('graphql');
// Import graphql types

// Type Schema Graphql
const Notifications = require('./types/notification')
console.log('Notifications: ', Notifications)


//import graphql Resolvers
// will add here . . .
const resolversFunc = require('../resolvers')

//Query Resolvers
// will add here . . .
const notifications = resolversFunc.notifications.notifications

//Mutations Resolvers
// will add here . . .
const pushNotification = resolversFunc.pushNotification.pushNotification

// Subscription
const newNotifications = resolversFunc.newNotifications.newNotifications


//Schema Definitions
const schemaDefinition = `
    type Query {
        # Example notif
        notifications: [Notifications]
    }

    type Mutation {
        # Example push notification 
        pushNotification(label: String!): Notifications

    }
    type Subscription {
        # Example notif sub
        newNotifications: Notifications
    }
    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`

module.exports = gqTools.makeExecutableSchema({
    typeDefs: [
        schemaDefinition,
        Notifications,
    ],
    resolvers: {
        Query: {
            notifications,
        },
        Mutation: {
            pushNotification
        },
        Subscription: {
            newNotifications
        }
    },
    
})
