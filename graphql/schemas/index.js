const gqTools = require('graphql-tools');
const { PubSub, withFilter } = require('graphql-subscriptions');
const pubsub = new PubSub();
const { subscribe } = require('graphql');
// Import graphql types

// Type Schema Graphql
const Notifications = require('./types/notification')
const flightScrapper = require('./types/flightScrapper')


//import graphql Resolvers
// will add here . . .
const resolversFunc = require('../resolvers')

//Query Resolvers
// will add here . . .
const notifications = resolversFunc.notifications.notifications

//Mutations Resolvers
// will add here . . .
const pushNotification = resolversFunc.pushNotification.pushNotification
const searchFlight = resolversFunc.flighScrapping.flighScrapping

// Subscription
const newNotifications = resolversFunc.newNotifications.newNotifications
const searchFlightResponse = resolversFunc.searchFlightResponse.searchFlightResponse

//Schema Definitions
const schemaDefinition = `
    type Query {
        # Example notif
        notifications: [Notifications]
    }

    type Mutation {
        # Example push notification 
        pushNotification(label: String!): Notifications
        searchFlight(input: searchFlight): responseFlightSearchPayload
    }
    type Subscription {
        # Example notif sub
        newNotifications: Notifications
        searchFlightResponse: responseFlightSearchPayload
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
        flightScrapper,
    ],
    resolvers: {
        Query: {
            notifications,
        },
        Mutation: {
            pushNotification,
            searchFlight,
        },
        Subscription: {
            newNotifications,
            searchFlightResponse,
        }
    },
    
})
