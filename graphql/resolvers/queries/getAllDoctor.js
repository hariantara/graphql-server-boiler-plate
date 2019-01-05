var db = require('../../../mysql_connection')

const getAllDoctor = async (_, args, context) => {
    // if (context.userAuth.role !== 3) {
    //     return {
    //         error: "Un Authorized"
    //     }
    // }
    try{
        let getAllDataDoctor = await db.execute(`
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
            join clinic c on c.id = u.clinic_id
            where u.deleted_at is null and role = 1
        `)

        console.log('getAllDataDoctor: ', getAllDataDoctor)
        if (getAllDataDoctor[0].length > 0){
            let user = await Promise.all(getAllDataDoctor[0].map(async(data)=>{
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
                user, 
                error: null
            }
        }else{
            return {
                user: [],
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
    getAllDoctor
}