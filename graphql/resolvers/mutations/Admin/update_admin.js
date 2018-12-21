var db = require('../../../../mysql_connection')

const updateAdmin = async (_, args, context) => {
    console.log('MASUK BOS: ')
    console.log('args: ', args)
    
    if(context.userAuth.role !== 3){
        return {error: 'Un Authorized'}
    }

    try{
        let id = args.input.id,
            name = args.input.name,
            username = args.input.username,
            email = args.input.email,
            phone = args.input.phone,
            id_card = args.input.id_card,
            sip = args.input.sip,
            photo = args.input.photo

        let update = `
            update users 
            set name ='${name}', 
            username ='${username}', 
            email ='${email}', 
            phone ='${phone}',
            id_card ='${id_card}', 
            SIP ='${sip}', 
            photo ='${photo}'
            where id = ${id} and role = 3;
        `

        let updateUser = await db.execute(update)
        console.log('updateUser: ', updateUser)

        if (updateUser[0].affectedRows === 1){
            let findDataBaseOnId = await db.execute(`select * from users where id = ${id}`)
            console.log('findDataBaseOnId: ', findDataBaseOnId[0])

            if (findDataBaseOnId[0].length > 0){
                let user = await Promise.all(findDataBaseOnId[0].map(async(data)=>{
                    let result = {
                        id: data.id,
                        name: data.name,
                        username: data.username,
                        email: data.email,
                        password: "*****",
                        phone: data.phone,
                        id_card: data.id_card,
                        sip: data.sip,
                        photo: data.photo
                    }

                    return result
                }))

                return {
                    user: user[0],
                    error: null
                }
            }else{
                throw {message: 'no data exist'}
            }
        }else{
            throw {message: 'failed to update, please try again'}
        }
    }catch(err){
        console.log("error: ", err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    updateAdmin,
}