var db = require('../../../mysql_connection')

const getUserList = async(_, args, context) => {
    // console.log('_: ', _)
    // console.log('args: ', _)
    // console.log('context: ', context.userAuth)

    if (context.userAuth.role !== 3){
        return {
            error: "Un Authorized"
        }
    }

    try{
        let getAllUsers = await db.execute(`select * from users where deleted_at is NULL`)
        // console.log('getAllUsers: ', getAllUsers.length)
        if (getAllUsers[0].length > 0){
            let user = await Promise.all(getAllUsers[0].map(async(data)=>{
                let result = {
                    id: data.id,
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    password: data.password ? "*****" : "no password",
                    phone: data.phone,
                    id_card: data.id_card,
                    sip: data.SIP,
                    photo: data.photo
                }
                return result
            }))

            // console.log('user: ', user)

            return {
                user: user,
                error: null
            }
        }else{
            throw {message: 'no data'}
        }
    }catch(err){
        // console.log(err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    getUserList,
}