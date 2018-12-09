let clinic;

module.exports = () => [clinic];

clinic = `
    type clinic {
        id: Int
        clinic_name: String 
        clinic_mobile: String
        clinic_address: String 
        clinic_email: String 
        clinic_lat: String 
        clinic_long: String
    }

    input clinicInput {
        clinic_name: String 
        clinic_mobile: String
        clinic_address: String 
        clinic_email: String 
        clinic_lat: String 
        clinic_long: String
    }

    type clinicPayload {
        clinic: clinic
        error: String
    }
`