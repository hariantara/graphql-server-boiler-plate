const { PubSub } = require("graphql-subscriptions");
// console.log('PubSub: ', PubSub)
const pubsub = new PubSub();

module.exports = pubsub