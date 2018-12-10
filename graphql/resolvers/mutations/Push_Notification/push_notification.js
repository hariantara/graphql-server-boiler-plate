const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();

var notifications = [];

var pushNotification = async(root, args, context) => {
    try{
        const newNotification = { label: args.label };

        notifications.push(newNotification);

        await pubsub.publish("newNotifications", { newNotification });
        
        return newNotification
    }catch(err){
        console.log('err => ', err.message)
    }
}

module.exports = {
    pushNotification,
    notifications
}