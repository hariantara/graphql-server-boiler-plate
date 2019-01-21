//Query
// will add here . . .

//Mutation

// Notification 
const notifications = require('./queries/notification')
const pushNotification = require('./mutations/Push_Notification/push_notification')
const newNotifications = require('./subscription/new_notification')

const resolversFunc = {
    notifications,
    pushNotification,
    newNotifications
}

module.exports = resolversFunc