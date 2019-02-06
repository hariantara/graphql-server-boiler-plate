let flightScrapper

module.exports = () => [flightScrapper]

flightScrapper = `
    input searchFlight {
        origin: String 
        destination: String 
        flightType: String
        departureDate: String 
        returningDate: String 
        traveller: [travellerTypeAndTotal]
    }

    input travellerTypeAndTotal{
        type: String
        total: Int
    }

    type responseFlightSearch {
        airlineName: String 
        arilineDetail:String
        departureTime: String
        arrivalTime: String
        departureAirport: String 
        arrivalAirport: String
        flightDuration: String
        transitStatus: Boolean 
    }

    type responseFlightSearchPayload {
        response: responseFlightSearch
        error: String
    }
`