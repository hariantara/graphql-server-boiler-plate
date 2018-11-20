const gqTools = require('graphql-tools');

// Import graphql types

// admin Types
const admin = require('./types/admin');
const doctorAdmin = require('./types/doctor_admin')

// doctor Types 
const doctor = require('./types/doctor')
const patient = require('./types/patient')

//import graphql Resolvers
const resolversFunc = require('../resolvers')

//Query Resolvers
const getUserList = resolversFunc.getUserList.getUserList

//Mutations Resolvers
// Admin
const createNewUser = resolversFunc.createNewUser.createNewUser
const updateAdmin = resolversFunc.updateAdmin.updateAdmin
const deleteAdmin = resolversFunc.deleteAdmin.deleteAdmin
const loginAdmin = resolversFunc.loginAdmin.loginAdmin
const createDoctorAdmin = resolversFunc.createDoctorAdmin.createDoctorAdmin
const updateDoctorAdmin = resolversFunc.updateDoctorAdmin.updateDoctorAdmin
const deleteDoctorAdmin = resolversFunc.deleteDoctorAdmin.deleteDoctorAdmin

// Doctor 
const doctorUpdate = resolversFunc.doctorUpdate.doctorUpdate
const doctorLogin = resolversFunc.doctorLogin.doctorLogin

// Patient
const patientRegister = resolversFunc.patientRegister.patientRegister
const patientLogin = resolversFunc.patientLogin.patientLogin
const patientUpdate = resolversFunc.patientUpdate.patientUpdate

//Schema Definitions
const schemaDefinition = `
    type Query {
        getUserList: getAlluser
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

        # Doctor 
        doctorUpdate(input: updateDoctor): createDoctorPayload
        doctorLogin(input: doctorLogin): doctorLoginPayload

        # Patient
        patientRegister(input: patientRegister): patientPayload
        patientLogin(input: patientLogin): patientLoginPayload
        patientUpdate(input: patientUpdate): patientPayload
    }
    schema {
        query: Query
        mutation: Mutation
    }
`

module.exports = gqTools.makeExecutableSchema({
    typeDefs: [
        schemaDefinition,
        admin,
        doctorAdmin,
        doctor,
        patient
    ],
    resolvers: {
        Query: {
            getUserList
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
            patientUpdate
        }
    },
    
})
