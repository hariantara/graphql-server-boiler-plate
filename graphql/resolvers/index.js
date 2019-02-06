//Query
const notifications = require('./queries/notification')
// add your queries here like <notifications>

//Mutation
// Notification 
const pushNotification = require('./mutations/Push_Notification/push_notification')
const flighScrapping = require('./mutations/Flight_Scrapping/flight_scrapping')
// add your queries here like <pushNotification>

// Subcription
const newNotifications = require('./subscription/new_notification')
const searchFlightResponse = require('./subscription/Flight_Scrapping_Subsription')
// add your queries here like <newNotifications>

const resolversFunc = {
    notifications,
    pushNotification,
    newNotifications,
    flighScrapping,
    searchFlightResponse
}

module.exports = resolversFunc