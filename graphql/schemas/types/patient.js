let patient

module.exports = () => [patient]

patient = `
    type patient {
        id: Int
        name: String 
        username: String 
        email: String 
        password: String 
        phone: String
        id_card: String 
        photo: String 
    }

    type patientPayload {
        patient: patient
        error: String
    }

    input patientRegister {
        name: String 
        password: String
        username: String 
        email: String 
        phone: String
        id_card: String 
        photo: String
    }

    input patientLogin {
        username: String 
        password: String
    }

    type patientLoginPayload {
        token: String 
        role: Int 
        error: String
    }

    input patientUpdate {
        name: String 
        username: String 
        email: String 
        phone: String
        id_card: String 
        photo: String
    }
`