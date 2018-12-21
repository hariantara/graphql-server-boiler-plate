const pubsub = require('../../schemas/pubsub')
const variables = require('../../schemas/variables')
const NOTIFICATION_SUBSCRIPTION_TOPIC = variables.notificationVariables

const newNotifications = {
    subscribe: async(root, args, context) => {
        console.log('Masuk Subscription')
        // console.log('context: ', context)
        return await pubsub.asyncIterator(NOTIFICATION_SUBSCRIPTION_TOPIC)
    }
}

module.exports = {
    newNotifications
}