var db = require('../../../../mysql_connection') 

const patientUpdate = async (_, args, context) => {
    if (context.userAuth.role !== 2) {
        return { error: 'Un Authorized' }
    }

    try{
        let id = context.userAuth.id,
            name = args.input.name,
            username = args.input.username.toLowerCase(),
            email = args.input.email.toLowerCase(),
            phone = args.input.phone,
            id_card = args.input.id_card,
            photo = args.input.photo

        let checkId = await db.execute(`select * from users where id = ${id} and deleted_at is null and role = 2`)
        console.log('checkId: ', checkId)

        if(checkId[0].length > 0){
            let updatePatient = `
                update users set name = ?,
                username = ?,
                email = ?,
                phone = ?,
                id_card = ?,
                photo = ?
                where id = ?
                and deleted_at is null
                and role = 2
            `

            let runUpdatePatient = await db.execute(updatePatient, [name, username, email, phone, id_card, photo, id])

            if(runUpdatePatient[0].affectedRows === 1){
                let getUpdatedUsers = await db.execute(`select * from users where id = ${id} and deleted_at is null and role = 2`)
                console.log('getUpdatedUsers: ', getUpdatedUsers)

                let patient = await Promise.all(getUpdatedUsers[0].map(async(data)=>{
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
                    patient: patient[0],
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
    patientUpdate
}