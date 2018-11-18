var db = require('../../../../mysql_connection')
var argon2 = require('argon2')
var jwt = require('jsonwebtoken')

const loginAdmin = async (_, args, context) => {
    // console.log('_: ', _)
    console.log('args: ', args)
    // console.log('context: ', context)

    try{
        let username = args.input.username,
            password = args.input.password 

        let getDbPassword = await db.execute(`select * from users where username = '${username}' or email = '${username}'`)

        let decrypt = await argon2.verify(getDbPassword[0][0].password, password)
        console.log('decrypt: ', decrypt)
        if (decrypt){
            let token = await jwt.sign({ 
                name: getDbPassword[0][0].name,
                username: getDbPassword[0][0].username,
                email: getDbPassword[0][0].email,
                role: getDbPassword[0][0].role
            }, process.env.SALT);
            console.log('token: ', token)

            return {
                token: token,
                role: getDbPassword[0][0].role,
                error: null
            }
        }else{
            throw {message: 'unauthorized'}
        }
    }catch(err){
        console.log(err)
        return{
            token: null,
            role: null,
            error: err.message
        }
    }
}

module.exports = {
    loginAdmin,
}