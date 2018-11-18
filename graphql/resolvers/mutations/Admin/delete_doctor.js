var db = require('../../../../mysql_connection')

const deleteDoctorAdmin = async (_, args, context) => {
    console.log('args: ', args)
    // if (context.userAuth.role !== 3) {
    //     return {
    //         error: 'Un Authorized'
    //     }
    // }

    try{
        let id = args.input.id 

        let checkId = await db.execute(`select * from users where id = ${id} and role = 1`)
        console.log('checkId: ', checkId)

        if (checkId[0].length > 0){
            let deteleUsersDoctor = await db.execute(`update users set deleted_at = now() where id = ${id} and role = 1`)
            console.log('deteleUsersDoctor: ', deteleUsersDoctor)

            if (deteleUsersDoctor[0].affectedRows === 1){
                let getDetailDeletedUsers = await db.execute(`select * from users where id = ${id} and role = 1 and deleted_at is not null`)
                console.log('getDetailDeletedUsers: ', getDetailDeletedUsers)

                let doctor = await Promise.all(getDetailDeletedUsers[0].map(async(data)=>{
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        password: "*****",
                        email: data.email,
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
        return {error: err.message}
    }
}

module.exports = {
    deleteDoctorAdmin
}