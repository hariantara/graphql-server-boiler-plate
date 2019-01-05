var db = require('../../../mysql_connection')

const getDetailBookAdmin = async (_, args, context) => {
    try{
        let book_id = args.book_id
        console.log('book_id: >>>', book_id)
        let getDetailBook = await db.execute(`
            select * from book_detail where id = ? and deleted_at is null
        `, [book_id])

        console.log('getDetailBook: ', getDetailBook)
        if (getDetailBook[0].length > 0){
            let booking = await Promise.all(getDetailBook[0].map(async(data)=>{
                let result = {
                    id: data.id,
                    book_id: data.book_id,
                    clinic_id: data.clinic_id,
                    patient_id: data.patient_id,
                    doctor_id: data.doctor_id,
                    symptom: data.symptom,
                    time: data.time,
                    status: data.status,
                    created_at: data.created_at,
                    updated_at: data.updated_at,
                    deleted_at: data.deleted_at
                }
                return result
            }))

            return {
                booking: booking[0],
                error: null
            }
        }else{
            throw {message: "invalid book id"}
        }
    }catch(err){
        console.log('err: ', err)
    }
}

module.exports = {
    getDetailBookAdmin
}