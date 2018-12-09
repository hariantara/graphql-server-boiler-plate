var db = require('../../../../mysql_connection')
var argon2 = require('argon2')

const createClinic = async (_, args, context) => {
    try{
        let clinic_name = args.input.clinic_name,
            clinic_mobile = args.input.clinic_mobile,
            clinic_address = args.input.clinic_address,
            clinic_email = args.input.clinic_email,
            clinic_lat = args.input.clinic_lat,
            clinic_long = args.input.clinic_long

        let query = `
            insert into clinic 
            (
                clinic_name,
                clinic_mobile,
                clinic_address,
                clinic_email,
                clinic_lat,
                clinic_long
            )
            values
            (
                ?,?,?,?,?,?
            )
        `

        let insert = await db.execute(query, [clinic_name, clinic_mobile, clinic_address, clinic_email, clinic_lat, clinic_long])
        console.log('insert: ', insert)

        if (insert[0].affectedRows === 1){
            let insertId = insert[0].insertId

            let getBackDetail = await db.execute(`select * from clinic where id = ${insertId} and deleted_at is null`)
            console.log('getBackDetail: ', getBackDetail)

            if (getBackDetail[0].length > 0){
                return {
                    clinic: getBackDetail[0][0],
                    error: null
                }
            }else{
                throw {message: 'failed to input data'}
            }
        }else{
            throw {message: 'failed to insert data to db'}
        }
    }catch(err){
        console.log('err')
        return {
            error: err.message
        }
    }
}

module.exports = {
    createClinic
}