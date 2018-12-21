var db = require('../../../mysql_connection')

const getAllPatient = async (_, args, context) => {
    if (context.userAuth.role !== 3) {
        return {
            error: "Un Authorized"
        }
    }
    try {
        let getAllDataDoctor = await db.execute(`
            select * from users where deleted_at is null and role = 1
        `)

        console.log('getAllDataDoctor: ', getAllDataDoctor)
        if (getAllDataDoctor[0].length > 0) {
            let user = await Promise.all(getAllDataDoctor[0].map(async (data) => {
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
                user,
                error: null
            }
        } else {
            return {
                user: [],
                error: null
            }
        }
    } catch (err) {
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    getAllPatient
}