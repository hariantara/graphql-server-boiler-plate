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

//import graphql Resolvers
const resolversFunc = require('../resolvers')

//Query Resolvers
const getUserList = resolversFunc.getUserList.getUserList
const notifications = resolversFunc.notifications.notifications

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

// Patient
const patientRegister = resolversFunc.patientRegister.patientRegister
const patientLogin = resolversFunc.patientLogin.patientLogin
const patientUpdate = resolversFunc.patientUpdate.patientUpdate

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

        # Patient
        patientRegister(input: patientRegister): patientPayload
        patientLogin(input: patientLogin): patientLoginPayload
        patientUpdate(input: patientUpdate): patientPayload

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
        auth
    ],
    resolvers: {
        Query: {
            getUserList,
            notifications,
            authCheck
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
        },
        Subscription: {
            newNotifications
        }
    },
    
})
