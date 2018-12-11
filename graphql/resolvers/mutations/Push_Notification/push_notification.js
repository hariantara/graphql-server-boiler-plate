const pubsub = require('../../../schemas/pubsub')
const variables = require('../../../schemas/variables')
const NOTIFICATION_SUBSCRIPTION_TOPIC = variables.notificationVariables
const notifications = [];

const pushNotification = async (root, args, context) => {
    console.log('masuk mutation')
    
    const newNotification = { label: args.label };
    
    notifications.push(newNotification);

    await pubsub.publish(NOTIFICATION_SUBSCRIPTION_TOPIC, { newNotifications: newNotification});
    return newNotification;
}

module.exports = {
    pushNotification,
    notifications
}