//Query
const getUserList = require('./queries/users')

//Mutation
const createNewUser = require('./mutations/create_user')

const resolversFunc = {
    getUserList,
    createNewUser
}

module.exports = resolversFunc