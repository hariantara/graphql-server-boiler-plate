var db = require('../../../../mysql_connection')
var argon2 = require('argon2')
var jwt = require('jsonwebtoken')


const doctorLogin = async (_, args, context) => {
    console.log('args: ', args)

    try{
        let username = args.input.username,
            password = args.input.password

        let checkUsername = await db.execute(`select * from users where username = '${username}' or email = '${username}' or phone = '${username}' and deleted_at is null and role = 1`)
        // console.log('checkUsername: ', checkUsername)

        if (checkUsername[0].length > 0){
            let decrypt = await argon2.verify(checkUsername[0][0].password, password)
            // console.log('decrypt: ', decrypt)

            if(decrypt){
                let token = await jwt.sign({
                    id: checkUsername[0][0].id,
                    name: checkUsername[0][0].name,
                    username: checkUsername[0][0].username,
                    email: checkUsername[0][0].email,
                    role: checkUsername[0][0].role
                }, process.env.SALT)
                // console.log('token: ', token)

                if (token){
                    return {
                        token, 
                        role: checkUsername[0][0].role,
                        error: null
                    }
                }else{
                    throw {message: 'connection problem, please try again'}
                }
            }else{
                throw {message: 'wrong password'}
            }
        }else{
            throw {message: 'username or email or phone not found'}
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    doctorLogin
}