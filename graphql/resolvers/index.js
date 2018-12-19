//Query
const getUserList = require('./queries/users')
const authCheck = require('./queries/authCheck')
//Mutation

// Admin 
const createNewUser = require('./mutations/Admin/create_user')
const loginAdmin = require('./mutations/Admin/login_admin')
const updateAdmin = require('./mutations/Admin/update_admin')
const deleteAdmin = require('./mutations/Admin/delete_admin')
const createDoctorAdmin = require('./mutations/Admin/create_doctor')
const updateDoctorAdmin = require('./mutations/Admin/update_doctor')
const deleteDoctorAdmin = require('./mutations/Admin/delete_doctor')

// Admin for CLINIC management
const createClinic = require('./mutations/Admin/create_clinic')
const updateClinic = require('./mutations/Admin/update_clinic')

// Doctor 
const doctorUpdate = require('./mutations/Doctor/doctor_update')
const doctorLogin = require('./mutations/Doctor/doctor_login')

// Patient 
const patientRegister = require('./mutations/Patient/patient_register')
const patientLogin = require('./mutations/Patient/patient_login')
const patientUpdate = require('./mutations/Patient/patient_update')

// Notification 
const notifications = require('./queries/notification')
const pushNotification = require('./mutations/Push_Notification/push_notification')
const newNotifications = require('./subscription/new_notification')

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
    patientUpdate,
    createClinic,
    notifications,
    pushNotification,
    newNotifications,
    updateClinic,
    authCheck
}

module.exports = resolversFunc