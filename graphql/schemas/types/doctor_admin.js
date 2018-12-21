let doctorAdmin;

module.exports = () => [doctorAdmin];

doctorAdmin = `
    type doctorAdmin {
        id: Int
        clinic_id: Int
        clinic_name: String 
        clinic_address: String
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
        doctor: doctorAdmin 
        error: String
    }

    type getAllDoctorPayload {
        user: [doctorAdmin ]
        error: String
    }

    input createDoctorAdmin {
        clinic_id: Int
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
        clinic_id: Int
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