let doctorAdmin;

module.exports = () => [doctorAdmin];

doctorAdmin = `
    type doctorAdmin {
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

    type createDoctorPayloadAdmin {
        doctor: doctor 
        error: String
    }

    input createDoctorAdmin {
        name: String 
        username: String 
        email: String 
        password: String 
        phone: String
        id_card: String 
        sip: String 
        photo: String
    }

    input updateDoctorAdmin {
        id: Int
        name: String 
        username: String 
        email: String 
        phone: String
        id_card: String 
        sip: String 
        photo: String
    }

    input deleteDoctorAdmin {
        id: Int
    }
`