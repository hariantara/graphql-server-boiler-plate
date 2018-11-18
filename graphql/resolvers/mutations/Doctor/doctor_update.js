var db = require('../../../../mysql_connection')

const doctorUpdate = async (_, args, context) => {
    console.log('args: ', args)

    if (context.userAuth.role !== 1) {
        return { error: 'Un Authorized' }
    }

    try{
        let id = args.input.id,
            name = args.input.name,
            username = args.input.username.toLowerCase(),
            email = args.input.email.toLowerCase(),
            phone = args.input.phone,
            id_card = args.input.id_card,
            sip = args.input.sip,
            photo = args.input.photo 

        let checkId = await db.execute(`select * from users where id = ${id} and deleted_at is null and role = 1`)
        console.log('checkId: ', checkId)

        if (checkId[0].length > 0){
            let updateDoctor = `
                update users set name = '${name}',
                username = '${username}',
                email = '${email}',
                phone = '${phone}',
                id_card = '${id_card}',
                SIP = '${sip}',
                photo = '${photo}'
                where id = ${id}
                and deleted_at is null
                and role = 1
            `

            let runUpdateDoctor = await db.execute(updateDoctor)
            console.log('runUpdateDoctor: ', runUpdateDoctor)

            if (runUpdateDoctor[0].affectedRows === 1){
                let getUpdatedUsers = await db.execute(`select * from users where id = ${id} and deleted_at is null and role = 1`)
                console.log('getUpdatedUsers: ', getUpdatedUsers)

                let doctor = await Promise.all(getUpdatedUsers[0].map(async(data)=>{
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        password: "*****",
                        phone: data.phone,
                        id_card: data.id_card,
                        sip: data.SIP,
                        photo: data.photo
                    }
                    return result
                }))

                return {
                    doctor: doctor[0],
                    error: null
                }
            }else{
                throw {message: 'connection problem, please try again'}
            }
        }else{
            throw {message: 'data not found'}
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    doctorUpdate
}