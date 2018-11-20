//Query
const getUserList = require('./queries/users')

//Mutation

// Admin 
const createNewUser = require('./mutations/Admin/create_user')
const loginAdmin = require('./mutations/Admin/login_admin')
const updateAdmin = require('./mutations/Admin/update_admin')
const deleteAdmin = require('./mutations/Admin/delete_admin')
const createDoctorAdmin = require('./mutations/Admin/create_doctor')
const updateDoctorAdmin = require('./mutations/Admin/update_doctor')
const deleteDoctorAdmin = require('./mutations/Admin/delete_doctor')

// Doctor 
const doctorUpdate = require('./mutations/Doctor/doctor_update')
const doctorLogin = require('./mutations/Doctor/doctor_login')

// Patient 
const patientRegister = require('./mutations/Patient/patient_register')
const patientLogin = require('./mutations/Patient/patient_login')
const patientUpdate = require('./mutations/Patient/patient_update')

const resolversFunc = {
    getUserList,
    createNewUser,
    loginAdmin,
    updateAdmin,
    deleteAdmin,
    createDoctorAdmin,
    updateDoctorAdmin,
    deleteDoctorAdmin,
    doctorUpdate,
    doctorLogin,
    patientRegister,
    patientLogin,
    patientUpdate
}

module.exports = resolversFunc