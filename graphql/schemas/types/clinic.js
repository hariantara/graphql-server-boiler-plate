let clinic;

module.exports = () => [clinic];

clinic = `
    type location {
        lat: String
        lng: String 
    }

    type viewport {
        northeast: location
        southwest: location
    }

    type clinic {
        id: Int
        clinic_name: String 
        clinic_mobile: String
        clinic_address: String 
        clinic_email: String 
        location: location
        viewport: viewport
        place_id: String
    }

    input clinicInput {
        clinic_name: String 
        clinic_mobile: String
        clinic_address: String 
        clinic_email: String 
    }

    input clinicUpdate {
        id: Int
        clinic_name: String 
        clinic_mobile: String
        clinic_address: String 
        clinic_email: String 
    }

    type clinicPayload {
        clinic: clinic
        error: String
    }
`