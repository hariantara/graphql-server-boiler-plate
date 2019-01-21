//Query
const notifications = require('./queries/notification')
// add your queries here like <notifications>

//Mutation
// Notification 
const pushNotification = require('./mutations/Push_Notification/push_notification')
// add your queries here like <pushNotification>

// Subcription
const newNotifications = require('./subscription/new_notification')
// add your queries here like <newNotifications>

const resolversFunc = {
    notifications,
    pushNotification,
    newNotifications
}

module.exports = resolversFunc