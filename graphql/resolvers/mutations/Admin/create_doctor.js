var db = require('../../../../mysql_connection')
var argon2 = require('argon2')

const createDoctorAdmin = async (_, args, context) => {
    // console.log('_: ', _)
    // console.log('args: ', args)
    console.log('context: ', context.userAuth)

    if (context.userAuth.role !== 3){
        return {
            error: 'Un Authorized'
        }
    }

    try{
        let name = args.input.name.toLowerCase(),
            username = args.input.username,
            email = args.input.email.toLowerCase(),
            password = args.input.password,
            phone = args.input.phone,
            id_card = args.input.id_card,
            sip = args.input.sip,
            photo = args.input.photo === '' ? `${process.env.LINK}/static/uploads/user.png` : args.input.photo

        let checkUsernameEmailExist = await db.execute(`select username, email from users where username = '${username}' or email = '${username}' and role = 3`)
        // console.log('checkUsernameEmailExist: ', checkUsernameEmailExist)

        if (checkUsernameEmailExist[0].length > 0){
            // data is exist, dont create
            // console.log('exist, and system not create')

            throw {message: 'account is exist'}
            
        }else{
            // not exist, create new
            // console.log('data not exist, system will create new')
            let encrypt_password = await argon2.hash(password)
            let insert = `
                insert into users 
                (name, username, email, password, phone, id_card, SIP, role, photo)
                values 
                ('${name}', '${username}', '${email}', '${encrypt_password}', '${phone}', '${id_card}', '${sip}', 1, '${photo}')
            `
            let run_insert = await db.execute(insert)
            // console.log('run_insert: ', run_insert)

            if (run_insert[0].affectedRows === 1){
                let id_user = run_insert[0].insertId

                let getUser = await db.execute(`select * from users where id = ${id_user}`)
                // console.log('getUser: ', getUser)

                let doctor = await Promise.all(getUser[0].map(async(data)=> {
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        password: "******",
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
            }
        }
    }catch(err){
        // console.log(err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    createDoctorAdmin,
}