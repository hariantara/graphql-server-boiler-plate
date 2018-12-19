var db = require('../../../mysql_connection')

const authCheck = async (_, args, context) => {
    try{
        console.log('context: ', context)
        if(context.userAuth.error){
            throw { message: context.userAuth.error}
        }else{
            let auth = {
                name: context.userAuth.name,
                photo: context.userAuth.photo
            }

            return {
                auth,
                error: null
            }
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    authCheck
}