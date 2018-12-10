const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

var newNotification = {
    subscribe: () => pubsub.asyncIterator('newNotification')
}

module.exports = {
    newNotification
}