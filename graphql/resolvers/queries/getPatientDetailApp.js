var db = require('../../../mysql_connection') 

const getPatientDetailApp = async (_, args, context) => {
    console.log('context: >>>',context)
    // if(context.userAuth === undefined){
    //     return{
    //         error: 'Un Authorized'
    //     }
    // }
    try{
        let id = context.userAuth.id 

        let getExistDataPatient = await db.execute(`
            select * from users where id = ? and deleted_at is null
        `,[id])

        console.log('getExistDataPatient: ', getExistDataPatient)

        if (getExistDataPatient[0].length > 0) {
            let user = await Promise.all(getExistDataPatient[0].map(async (data) => {
                let result = {
                    id: data.id,
                    name: data.name,
                    username: data.username,
                    email: data.email,
                    password: '*****',
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
        } else {
            throw { message: 'id invalid' }
        }
    }catch(err){
        console.log('err: ', err)
    }
}

module.exports = {
    getPatientDetailApp
}