var db = require('../../../../mysql_connection')
var argon2 = require('argon2')
// FOR ADMIN ONLY
const createNewUser = async (_, args, context) => {
    // console.log('_: ', _)
    console.log('args: ', args)
    // console.log('context: ', context)
    if (context.userAuth.role !== 3) {
        return { error: 'Un Authorized' }
    }
    
    try{
        let name = args.input.name,
            username = args.input.username,
            email = args.input.email,
            password = args.input.password,
            phone = args.input.phone,
            id_card = args.input.id_card,
            sip = args.input.sip,
            photo = args.input.photo

        let encryptPassword = await argon2.hash(password)
        let nameToLowercase = name.toLowerCase()
        let emailToLowercase = email.toLowerCase()

        let insertQuery = `
            insert into users 
            (name, username, email, password, phone, id_card, role, SIP, photo)
            values
            ('${nameToLowercase}', '${username}', '${emailToLowercase}', '${encryptPassword}', '${phone}', '${id_card}', ${3}, '${sip}', '${photo}')
        `  
        let runInsertQuery = await db.execute(insertQuery)     
        // console.log('runInsertQuery: ', runInsertQuery[0]) 

        if (runInsertQuery[0].affectedRows === 1){
            let db_id = runInsertQuery[0].insertId
            let getUsers = await db.execute(`select * from users where id = ${db_id}`)
            
            if (getUsers[0].length > 0){
                let user = await Promise.all(getUsers[0].map(async(data)=>{
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        password: data.password ? "*****" : "no password",
                        phone: data.phone,
                        id_card: data.id_card,
                        sip: data.SIP,
                        photo: data.photo
                    }
                    return result
                }))

                return {
                    user: user[0],
                    error: null
                }
            }else{
                throw {message: '[ADMIN] : failed to get data base on id'}
            }
        }else{
            throw { message: '[ADMIN] :failed to insert data to the server'}
        }
        
    }catch(err){
        console.log(err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    createNewUser,
}