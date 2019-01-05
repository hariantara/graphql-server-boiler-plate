var db = require('../../../mysql_connection')

const getDetailBookApp = async (_, args, context) => {
    try{
        let book_id = args.book_id
        console.log('book_id: ', book_id)
        let checkBookId = await db.execute(`
            select 
            bd.id as id,
            bd.book_id as book_id,
            bd.clinic_id as clinic_id,
            bd.patient_id as patient_id,
            bd.doctor_id as doctor_id,
            bd.symptom as symptom,
            bd.time as time,
            bd.status as status,
            bd.created_at as created_at,
            bd.updated_at as updated_at,
            bd.deleted_at as deleted_at,
            doc.name as doctor_name,
            doc.photo as doctor_photo,
            pat.name as patient_name,
            pat.photo as patient_photo
            from book_detail bd
            join users doc on doc.id = bd.doctor_id
            join users pat on pat.id = bd.patient_id
            where bd.id = ? and bd.deleted_at is null 
            ORDER BY coalesce(bd.updated_at, bd.created_at) DESC, bd.id DESC
        `, [book_id])

        console.log('checkBookId: ', checkBookId)
        if (checkBookId[0].length > 0){
            let booking = await Promise.all(checkBookId[0].map(async (data) => {
                let result = {
                    id: data.id,
                    book_id: data.book_id,
                    clinic_id: data.clinic_id,
                    patient_id: data.patient_id,
                    patient_name: data.patient_name,
                    patient_photo: data.patient_photo,
                    doctor_id: data.doctor_id,
                    doctor_name: data.doctor_name,
                    doctor_photo: data.doctor_photo,
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
        return {
            error: err.message
        }
    }
}

module.exports = {
    getDetailBookApp
}