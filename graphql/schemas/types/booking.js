let booking; 

module.exports = () => [booking]

booking = `
    type booking {
        id: Int 
        book_id: String 
        clinic_id: Int 
        patient_id: Int 
        doctor_id: Int 
        symptom: String 
        time: String
        status: String 
        created_at: String 
        updated_at: String 
        deleted_at: String 
    }

    type getAllBookApp {
        id: Int 
        book_id: String 
        clinic_id: Int 
        patient_id: Int 
        patient_name: String
        patient_photo: String
        doctor_id: Int 
        doctor_name: String 
        doctor_photo: String
        symptom: String 
        time: String
        status: String 
        created_at: String 
        updated_at: String 
        deleted_at: String 
    }

    type getAllBookAppPayload {
        booking: [getAllBookApp]
        error: String
    }

    type getAllBookAppSinglePayload {
        booking: getAllBookApp
        error: String
    }

    type bookingSinglePayload {
        booking: booking
        error: String
    }

    type bookingMutiplePayload {
        booking: [booking]
        error: String
    }

    input createBooking {
        clinic_id: Int 
        doctor_id: Int 
        symptom: String 
        time: String
    }
`