const notificationsData = require('../mutations/Push_Notification/push_notification')
console.log('notificationsData: ', notificationsData

)
const notifications = async (root, args, context) => {
    console.log('Masuk QUery')
    let notifications = notificationsData.notifications
    return notifications
}

module.exports = {
    notifications 
}