var db = require('../../../mysql_connection')

const saveFCMToken = async(_, args, context) => {
    try{
        console.log('args: ', args)
        console.log('context: ', context.userAuth)

        let token = args.token 
        let role = context.userAuth.role 

        if(role === 1){
            // doctor only
            let id = context.userAuth.id

            let checkExistToken = await db.execute(`
                select * from fcm where doctor_id = ?
            `, [id])

            if (checkExistToken[0].length > 0) {
                // do update 
                let update = await db.execute(`
                    update fcm 
                    set token = ? 
                    where doctor_id = ?
                `,[token, id])
                console.log('update: ', update)
                if (update[0].affectedRows === 1){
                    return true
                }else{
                    false
                }
            }else{
                // do insert 
                let insert = await db.execute(`
                    insert into fcm 
                    (doctor_id, token)
                    values
                    (?,?)
                `,[id, token])
                console.log('insert: ', insert)
                if (insert[0].affectedRows === 1){
                    return true
                }else{
                    return false
                }
            }
        }else if(role === 2){
            //  patient only
            let id = context.userAuth.id

            let checkExistToken = await db.execute(`
                select * from fcm where patient_id = ?
            `, [id])
            console.log('checkExistToken: ', checkExistToken)
            if (checkExistToken[0].length > 0) {
                // do update 
                let update = await db.execute(`
                    update fcm 
                    set token = ? 
                    where patient_id = ?
                `, [token, id])
                console.log('update: ', update)
                if (update[0].affectedRows === 1) {
                    return true
                } else {
                    false
                }
            } else {
                // do insert 
                let insert = await db.execute(`
                    insert into fcm 
                    (patient_id, token)
                    values
                    (?,?)
                `, [id, token])
                console.log('insert: ', insert)
                if (insert[0].affectedRows === 1) {
                    return true
                } else {
                    return false
                }
            }
        }
    }catch(err){
        console.log('err: ', err)
    }
}

module.exports = {
    saveFCMToken
}