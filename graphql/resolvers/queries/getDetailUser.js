var db = require('../../../mysql_connection')

const getDetailUser = async (_, args, context) => {
    if (context.userAuth.role !== 3) {
        return {
            error: "Un Authorized"
        }
    }

    try{
        let id = args.id
        let checkExistUser = await db.execute(`
            select * from users where id = ? and deleted_at is null and role = 3
        `,[id])
        console.log('checkExistUser: ', checkExistUser[0])

        if (checkExistUser[0].length > 0) {
            let user = await Promise.all(checkExistUser[0].map(async (data) => {
                let result = {
                    id: data.id,
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    password: '*****',
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
        } else {
            throw { message: 'id invalid' }
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    getDetailUser
}