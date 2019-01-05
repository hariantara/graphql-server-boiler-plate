var db = require('../../../../mysql_connection')
var argon2 = require('argon2')
var jwt = require('jsonwebtoken')

const patientLogin = async (_, args, context) => {
    try {
        let username = args.input.username,
            password = args.input.password 


        let getUsersData = await db.execute(`select * from users where username = '${username}' or email = '${username}' or phone = '${username}' and deleted_at is null`)

        let decrypt = await argon2.verify(getUsersData[0][0].password, password)

        if(decrypt){
            let token = await jwt.sign({ 
                id: getUsersData[0][0].id,
                name: getUsersData[0][0].name,
                username: getUsersData[0][0].username,
                email: getUsersData[0][0].email,
                role: getUsersData[0][0].role
            }, process.env.SALT);
            console.log('token: >>>>----', token)

            return {
                token: token,
                role: getUsersData[0][0].role,
                error: null
            }
        }else{
            throw {message: 'wrong password'}
        }
    }catch(err){
        console.log(err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    patientLogin
}