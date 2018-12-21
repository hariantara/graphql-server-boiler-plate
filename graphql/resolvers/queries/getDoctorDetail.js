var db = require('../../../mysql_connection')

const getDoctorDetail = async (_, args, context) => {
    if (context.userAuth.role !== 3) {
        return {
            error: "Un Authorized"
        }
    }

    try{
        let id = args.id
        let checkExistUser = await db.execute(`
             select
                        u.id as id,
                        u.name,
                        u.username,
                        u.email,
                        u.password,
                        u.phone,
                        u.id_card,
                        u.SIP as sip,
                        u.photo,
                        c.id as clinic_id,
                        c.clinic_name as clinic_name,
                        c.clinic_address as clinic_address
                        from users u
                        left join clinic c on c.id = u.clinic_id
                        where u.id = ${id} and u.deleted_at is null and role = 1
        `, [id])
        console.log('checkExistUser: ', checkExistUser[0])

        if (checkExistUser[0].length > 0) {
            let doctor = await Promise.all(checkExistUser[0].map(async (data) => {
                let result = {
                    id: data.id,
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    password: '*****',
                    phone: data.phone,
                    id_card: data.id_card,
                    sip: data.sip,
                    photo: data.photo,
                    clinic_id: data.clinic_id,
                    clinic_name: data.clinic_name,
                    clinic_address: data.clinic_address
                }
                return result
            }))
            return {
                doctor: doctor[0],
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
    getDoctorDetail
}