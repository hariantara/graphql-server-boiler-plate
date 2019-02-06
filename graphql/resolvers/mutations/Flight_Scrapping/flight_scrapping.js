const pubsub = require('../../../schemas/pubsub')
const variables = require('../../../schemas/variables')
const FLIGHT_SCRAPPING_RESPONSE = variables.searchFlightResponse
const scrapper = require('../../../../scrapper/flight_scrapper')
const moment = require('moment')

const flighScrapping = async (root, args, context) => {
    try{
        // console.log('masuk mutation ( flighScrapping )')
        
        // console.log('args: ', args)
        // console.log('context: ', context)

        var url = ''

        let origin = args.input.origin,
            destination = args.input.destination,
            flightType = args.input.flightType,
            departureDate = args.input.departureDate,
            returningDate = args.input.returningDate,
            traveller = args.input.traveller

        let objectMutation = {
            origin,
            destination,
            flightType,
            departureDate,
            returningDate,
            traveller
        }


        let data = objectMutation 

        if(data){
            let flightType = data.flightType,
                leg1 = {
                    from: data.origin,
                    to: data.destination,
                    dateDeparture: moment(new Date(data.departureDate)).format('MM/DD/YYYY')
                },
                leg2 = {
                    from: data.destination,
                    to: data.origin,
                    dateDeparture: moment(new Date(data.returningDate)).format('MM/DD/YYYY')
                }

            let traveller = data.traveller

            let adult = false,
                indexAdult = null
            totalAdult = 0

            let children = false,
                indexChildren = null
            totalChildren = 0

            let senior = false,
                indexSenior = null
            totalSenior = 0

            let count = 0

            await traveller.map((data, i) => {
                // console.log('data ........ ', data)
                if (data.type === 'adult') {
                    //  declare traveller only adult
                    adult = true
                    indexAdult = i
                    totalAdult = data.total
                    // count++
                } else if (data.type === 'children') {
                    // declare travelller only children 
                    children = true
                    indexAdult = i
                    totalAdult = data.total
                    // count++
                } else if (data.type === 'senior') {
                    // decalre traveller only
                    senior = true
                    indexAdult = i
                    totalAdult = data.total
                    // count++
                }
                count++
            })

            // console.log('COUNT: ', count)
            // console.log('Traveller Length: ', traveller.length)
            // console.log('TotalAdult: ', totalAdult)
            // console.log('IndexAdult: ', indexAdult)
            // console.log('Check Traveller: ', traveller[0].total)


            if (count === traveller.length) {
                if (adult === true) {
                    url = `https://expedia.com/Flights-Search?trip=${flightType}&leg1=from:${leg1.from},to:${leg1.to},departure:${leg1.dateDeparture}TANYT&leg2=from:${leg2.from},to:${leg2.to},departure:${leg2.dateDeparture}TANYT&passengers=children:0,adults:${traveller[indexAdult].total},seniors:0,infantinlap:&options=cabinclass:coach,nopenalty:N,sortby:price&mode=search`
                } else if (adult === true && children === true) {
                    url = `https://expedia.com/Flights-Search?trip=${flightType}&leg1=from:${leg1.from},to:${leg1.to},departure:${leg1.dateDeparture}TANYT&leg2=from:${leg2.from},to:${leg2.to},departure:${leg2.dateDeparture}TANYT&passengers=children:${traveller[indexChildren].total},adults:${traveller[indexAdult].total},seniors:0,infantinlap:&options=cabinclass:coach,nopenalty:N,sortby:price&mode=search`
                } else if (adult === true && children === true && senior === true) {
                    url = `https://expedia.com/Flights-Search?trip=${flightType}&leg1=from:${leg1.from},to:${leg1.to},departure:${leg1.dateDeparture}TANYT&leg2=from:${leg2.from},to:${leg2.to},departure:${leg2.dateDeparture}TANYT&passengers=children:${traveller[indexChildren].total},adults:${traveller[indexAdult].total},seniors:${traveller[indexSenior].total},infantinlap:&options=cabinclass:coach,nopenalty:N,sortby:price&mode=search`
                } else if (adult === true && senior === true) {
                    url = `https://expedia.com/Flights-Search?trip=${flightType}&leg1=from:${leg1.from},to:${leg1.to},departure:${leg1.dateDeparture}TANYT&leg2=from:${leg2.from},to:${leg2.to},departure:${leg2.dateDeparture}TANYT&passengers=children:0,adults:${traveller[indexAdult].total},seniors:${traveller[indexSenior].total},infantinlap:&options=cabinclass:coach,nopenalty:N,sortby:price&mode=search`
                } else if (senior === true && children === true) {
                    // senior && children
                    url = `https://expedia.com/Flights-Search?trip=${flightType}&leg1=from:${leg1.from},to:${leg1.to},departure:${leg1.dateDeparture}TANYT&leg2=from:${leg2.from},to:${leg2.to},departure:${leg2.dateDeparture}TANYT&passengers=children:${traveller[indexChildren].total},adults:0,seniors:${traveller[indexSenior].total},infantinlap:&options=cabinclass:coach,nopenalty:N,sortby:price&mode=search`
                } else {
                    // senior only
                    url = `https://expedia.com/Flights-Search?trip=${flightType}&leg1=from:${leg1.from},to:${leg1.to},departure:${leg1.dateDeparture}TANYT&leg2=from:${leg2.from},to:${leg2.to},departure:${leg2.dateDeparture}TANYT&passengers=children:0,adults:0,seniors:${traveller[indexSenior].total},infantinlap:&options=cabinclass:coach,nopenalty:N,sortby:price&mode=search`
                }
            }
            // console.log('gettingURL: ', url)

            if(url !== ''){
                // console.log('MUTATION URL: ', url)
                let senDataToScrapper = await scrapper.scrapping(url)
                // console.log('senDataToScrapper: ====>>>>>', senDataToScrapper)
            }
        }

        let searchFlightResponse = {
            response: {
                airlineName: origin,
                arilineDetail: origin,
                departureTime: origin,
                arrivalTime: origin,
                departureAirport: origin, 
                arrivalAirport: origin,
                flightDuration: origin,
                transitStatus: true 
            },
            error: null
        }

        await pubsub.publish(FLIGHT_SCRAPPING_RESPONSE, { searchFlightResponse: searchFlightResponse})
        return searchFlightResponse
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    flighScrapping
}