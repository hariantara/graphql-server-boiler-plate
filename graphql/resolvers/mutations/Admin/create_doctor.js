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
            photo = args.input.photo === '' ? `${process.env.LINK}/static/uploads/user.png` : args.input.photo,
            clinic_id = args.input.clinic_id

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
                (
                    name, 
                    username, 
                    email, 
                    password, 
                    phone, 
                    id_card, 
                    SIP, 
                    role, 
                    photo,
                    clinic_id
                )
                values 
                (
                    '${name}', 
                    '${username}', 
                    '${email}', 
                    '${encrypt_password}', 
                    '${phone}', 
                    '${id_card}', 
                    '${sip}', 
                    1, 
                    '${photo}',
                    ${clinic_id}
                )
            `
            let run_insert = await db.execute(insert)
            // console.log('run_insert: ', run_insert)

            if (run_insert[0].affectedRows === 1){
                let id_user = run_insert[0].insertId

                let getUser = await db.execute(`
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
                    where u.id = ${id_user} and u.deleted_at is null`
                )
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