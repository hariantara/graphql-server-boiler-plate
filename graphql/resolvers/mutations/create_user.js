const createNewUser = async (_, args, context) => {
    console.log('_: ', _)
    console.log('args: ', _)
    console.log('context: ', context)
}

module.exports = {
    createNewUser,
}