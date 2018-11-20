var db = require('../../../../mysql_connection')
var argon2 = require('argon2')

const patientRegister = async (_, args, context) => {
    console.log('args: ', args)

    try{
        let name = args.input.name,
            password = args.input.password,
            username = args.input.username.toLowerCase(),
            email = args.input.email.toLowerCase(),
            phone = args.input.phone,
            id_card = args.input.id_card,
            photo = args.input.photo === '' ? `${process.env.LINK}/static/uploads/user.png` : args.input.photo

        let encrypt = await argon2.hash(password)
        console.log('encrypt: ', encrypt)

        let insertPatient = `
            insert into users 
            (name, username, email, password, phone, id_card, role, photo)
            values 
            ('${name}', '${username}', '${email}', '${encrypt}', '${phone}', '${id_card}', 2, '${photo}')
        `

        let runPatient = await db.execute(insertPatient)
        console.log('runPatient: ', runPatient)

        if (runPatient[0].affectedRows === 1){
            let id = runPatient[0].insertId 
            let getInsertedData = await db.execute(`select * from users where id = ${id} and deleted_at is null and role = 2`)
            console.log('getInsertedData: ', getInsertedData)

            if (getInsertedData[0].length > 0){
                let patient = await Promise.all(getInsertedData[0].map(async(data)=>{
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        password: "*****",
                        email: data.email,
                        phone: data.phone,
                        id_card: data.id_card,
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
            throw {messgae: 'connection problem, please try again'}
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    patientRegister
}