let doctor; 

module.exports = () => [doctor]

doctor = `
    type doctor {
        id: Int
        name: String 
        username: String 
        email: String 
        password: String 
        phone: String
        id_card: String 
        sip: String
        photo: String 
    }

    type createDoctorPayload {
        doctor: doctor 
        error: String
    }

    input updateDoctor {
        id: Int
        name: String 
        username: String 
        email: String 
        phone: String
        id_card: String 
        sip: String 
        photo: String
    }

    input doctorLogin {
        username: String
        password: String
    }

    type doctorLoginPayload {
        token: String 
        role: Int
        error: String
    }
`