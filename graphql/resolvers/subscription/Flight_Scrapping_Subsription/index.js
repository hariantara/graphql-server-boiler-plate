const pubsub = require('../../../schemas/pubsub')
const variables = require('../../../schemas/variables')
const FLIGHT_SCRAPPING_RESPONSE = variables.searchFlightResponse

const searchFlightResponse = {
    subscribe: async(root, data, context) => {
        console.log('masuk subs ( searchFlightResponse )')
        return await pubsub.asyncIterator(FLIGHT_SCRAPPING_RESPONSE)
    }
}

module.exports = {
    searchFlightResponse
}