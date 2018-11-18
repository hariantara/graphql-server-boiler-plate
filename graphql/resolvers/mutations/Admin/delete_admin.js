var db = require('../../../../mysql_connection')

const deleteAdmin = async (_, args, context) => {
    // console.log(context)
    if(context.userAuth.role !== 3){
        return {
            error: "Un Authorized"
        }
    }

    try{
        let id = args.input.id 

        let checkExistId = await db.execute(`select * from users where id = ${id}`)
        // console.log('checkExistId: ', checkExistId)

        if (checkExistId[0].length > 0){
            let deleted_at = await db.execute(`update users set deleted_at = now() where id = ${id} and role = 3`)
            // console.log('deleted_at: ', deleted_at)

            if (deleted_at[0].affectedRows === 1){
                let getUserDataBaseOnId = await db.execute(`select * from users where id = ${id}`)
                // console.log('getUserDataBaseOnId: ', getUserDataBaseOnId)
                let user = await Promise.all(getUserDataBaseOnId[0].map(async(data)=>{
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        email: data.username,
                        password: "*****",
                        phone: data.phone,
                        id_card: data.id_card,
                        sip: data.SIP,
                        photo: data.photo
                    }
                    return result
                }))
                return {
                    user: user[0],
                    error: null
                }
            }else{
                throw {message: 'connection problem, please try again'}
            }
        }else{
            throw {message: 'data not found'}
        }
    }catch(err){
        // console.log(err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    deleteAdmin
}