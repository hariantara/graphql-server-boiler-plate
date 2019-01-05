const gqTools = require('graphql-tools');
const { PubSub, withFilter } = require('graphql-subscriptions');
const pubsub = new PubSub();
const { subscribe } = require('graphql');
// Import graphql types
// admin Types
const admin = require('./types/admin');
const doctorAdmin = require('./types/doctor_admin')
const clinic = require('./types/clinic')
const Notifications = require('./types/notification')
const auth = require('./types/auth')
// console.log('Notifications: ', Notifications)
// doctor Types 
const doctor = require('./types/doctor')
const patient = require('./types/patient')
const booking = require('./types/booking')
//import graphql Resolvers
const resolversFunc = require('../resolvers')

//Query Resolvers
const getUserList = resolversFunc.getUserList.getUserList
const notifications = resolversFunc.notifications.notifications
const getDetailUser = resolversFunc.getDetailUser.getDetailUser
const getDoctorDetail = resolversFunc.getDoctorDetail.getDoctorDetail
const getPatientDetail = resolversFunc.getPatientDetail.getPatientDetail
const getAllDoctor = resolversFunc.getAllDoctor.getAllDoctor
const getAllPatient = resolversFunc.getAllPatient.getAllPatient
const getAllClinic = resolversFunc.getAllClinic.getAllClinic
const getDetailClinic = resolversFunc.getDetailClinic.getDetailClinic
const getPatientDetailApp = resolversFunc.getPatientDetailApp.getPatientDetailApp
const getAllBookAdmin = resolversFunc.getAllBookAdmin.getAllBookAdmin
const getAllBookApp = resolversFunc.getAllBookApp.getAllBookApp
const getDetailBookAdmin = resolversFunc.getDetailBookAdmin.getDetailBookAdmin
const getDetailBookApp = resolversFunc.getDetailBookApp.getDetailBookApp
const saveFCMToken = resolversFunc.saveFCMToken.saveFCMToken
//Mutations Resolvers

// auth 
const authCheck = resolversFunc.authCheck.authCheck

// Admin
const createNewUser = resolversFunc.createNewUser.createNewUser
const updateAdmin = resolversFunc.updateAdmin.updateAdmin
const deleteAdmin = resolversFunc.deleteAdmin.deleteAdmin
const loginAdmin = resolversFunc.loginAdmin.loginAdmin
const createDoctorAdmin = resolversFunc.createDoctorAdmin.createDoctorAdmin
const updateDoctorAdmin = resolversFunc.updateDoctorAdmin.updateDoctorAdmin
const deleteDoctorAdmin = resolversFunc.deleteDoctorAdmin.deleteDoctorAdmin

// Admin Clinic Management
const createClinic = resolversFunc.createClinic.createClinic
const updateClinic = resolversFunc.updateClinic.updateClinic

// Doctor 
const doctorUpdate = resolversFunc.doctorUpdate.doctorUpdate
const doctorLogin = resolversFunc.doctorLogin.doctorLogin
const doctorResponseBooking = resolversFunc.doctorResponseBooking.doctorResponseBooking
// Patient
const patientRegister = resolversFunc.patientRegister.patientRegister
const patientLogin = resolversFunc.patientLogin.patientLogin
const patientUpdate = resolversFunc.patientUpdate.patientUpdate
const createBooking = resolversFunc.createBooking.createBooking


const pushNotification = resolversFunc.pushNotification.pushNotification

// Subscription
var newNotifications = resolversFunc.newNotifications.newNotifications
console.log('newNotification:', newNotifications)


//Schema Definitions
const schemaDefinition = `
    type Query {
        # auth
        authCheck: auth 
        
        getUserList: getAlluser
        notifications: [Notifications]

        getDetailUser(id: Int): getDetailUser
        getDoctorDetail(id: Int): createDoctorPayloadAdmin
        getPatientDetail(id: Int): getDetailUser
        getPatientDetailApp: getDetailUser

        getAllDoctor: getAllDoctorPayload
        getAllPatient: getAlluser

        getAllClinic: clinicAllPayload
        getDetailClinic(id: Int): clinicPayload

        getAllBookAdmin: bookingMutiplePayload
        getAllBookApp: getAllBookAppPayload
        getDetailBookAdmin(book_id: Int):bookingSinglePayload
        getDetailBookApp(book_id: Int): getAllBookAppSinglePayload

        saveFCMToken(token: String): Boolean
    }

    type Mutation {

        # Admin
        createNewUser(input: newUser): createNewUserPayload
        loginAdmin(input: loginAdmin): loginAdminPayload
        updateAdmin(input: updateAdmin): createNewUserPayload
        deleteAdmin(input: deleteAdmin): createNewUserPayload

        createDoctorAdmin(input: createDoctorAdmin): createDoctorPayloadAdmin
        updateDoctorAdmin(input: updateDoctorAdmin): createDoctorPayloadAdmin
        deleteDoctorAdmin(input: deleteDoctorAdmin): createDoctorPayloadAdmin

        createClinic(input: clinicInput): clinicPayload
        updateClinic(input: clinicUpdate): clinicPayload

        # Doctor 
        doctorUpdate(input: updateDoctor): createDoctorPayload
        doctorLogin(input: doctorLogin): doctorLoginPayload
        doctorResponseBooking(book_id: Int, response: String): bookingSinglePayload

        # Patient
        patientRegister(input: patientRegister): patientPayload
        patientLogin(input: patientLogin): patientLoginPayload
        patientUpdate(input: patientUpdate): patientPayload
        createBooking(input: createBooking): bookingSinglePayload


        # Push Notification 
        pushNotification(label: String!): Notifications

    }
    type Subscription {
        newNotifications: Notifications
    }
    schema {
        query: Query
        mutation: Mutation
        subscription: Subscription
    }
`

module.exports = gqTools.makeExecutableSchema({
    typeDefs: [
        schemaDefinition,
        admin,
        doctorAdmin,
        doctor,
        patient,
        clinic,
        Notifications,
        auth,
        booking
    ],
    resolvers: {
        Query: {
            getUserList,
            notifications,
            authCheck,
            getDetailUser,
            getDoctorDetail,
            getPatientDetail,
            getAllDoctor,
            getAllPatient,
            getAllClinic,
            getDetailClinic,
            getPatientDetailApp,
            getAllBookAdmin,
            getAllBookApp,
            getDetailBookAdmin,
            getDetailBookApp,
            saveFCMToken
        },
        Mutation: {
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
            updateClinic,
            pushNotification,
            createBooking,
            doctorResponseBooking
        },
        Subscription: {
            newNotifications
        }
    },
    
})
