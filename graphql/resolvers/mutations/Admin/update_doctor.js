var db = require('../../../../mysql_connection')
var argon2 = require('argon2')

const updateDoctorAdmin = async (_, args, context) => {
    // console.log('context: ', context)
    console.log('args: ', args)
    // Todo put auth here ... 

    if (context.userAuth.role !== 3) {
        return { error: 'Un Authorized' }
    }

    try{
        let id = args.input.id,
            name = args.input.name.toLowerCase(),
            email = args.input.email.toLowerCase(),
            username = args.input.username,
            phone = args.input.phone,
            id_card = args.input.id_card,
            sip = args.input.sip,
            photo = args.input.photo,
            clinic_id = args.input.clinic_id

        let checkId = await db.execute(`select * from users where id = ${id} and role = 1 and deleted_at is null`)
        console.log('checkId: ', checkId[0])

        if(checkId[0].length > 0){
            let updateData = `
                update users 
                set name = '${name}',
                username = '${username}',
                email = '${email}',
                phone = '${phone}',
                id_card = '${id_card}',
                SIP = '${sip}',
                photo = '${photo}',
                clinic_id = ${clinic_id}
                where id = ${id} 
                and deleted_at is null
            `

            let runUpdateUsers = await db.execute(updateData)
            console.log('runUpdateUsers: ', runUpdateUsers)

            if (runUpdateUsers[0].affectedRows === 1) {
                let getUsersById = await db.execute(
                    `
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
                        where u.id = ${id} and u.deleted_at is null
                    `
                )
                let doctor = await Promise.all(getUsersById[0].map(async (data) => {
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        password: "******",
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
                throw { message: 'failed to update data' }
            }
        }else{
            throw {message: 'data not found'}
        }
    }catch(err){
        console.log('err: ', err)
        return{error: err.message}
    }
}

module.exports = {
    updateDoctorAdmin
}