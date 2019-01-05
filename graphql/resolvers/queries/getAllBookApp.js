var db = require('../../../mysql_connection')

const getAllBookApp = async (_, args, context) => {
    // console.log('context: ', context)
    try{
        let role = context.userAuth.role 
        console.log('role: ', role)

        if(role === 1){
            // doctor only 
            let id = context.userAuth.id
            let getAllBookData = await db.execute(`
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
                where bd.doctor_id = ? and bd.deleted_at is null 
                ORDER BY coalesce(bd.updated_at, bd.created_at) DESC, bd.id DESC
            `,[id])
            console.log('getAllBookData: ', getAllBookData)
            if (getAllBookData[0].length > 0){
                let booking = await Promise.all(getAllBookData[0].map(async (data) => {
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
                    booking,
                    error: null
                }
            }else{
                return {
                    booking: [],
                    error: null
                }
            }
        }else if(role === 2){
            //  patient only
            let id = context.userAuth.id
            let getAllBookData = await db.execute(`
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
                where bd.patient_id = ? and bd.deleted_at is null 
                ORDER BY coalesce(bd.updated_at, bd.created_at) DESC, bd.id DESC
            `, [id])
            console.log('getAllBookData: ', getAllBookData)
            if (getAllBookData[0].length > 0) {
                let booking = await Promise.all(getAllBookData[0].map(async(data)=>{
                    let result = {
                        id: data.id,
                        book_id: data.book_id ,
                        clinic_id: data.clinic_id, 
                        patient_id: data.patient_id, 
                        patient_name: data.patient_name,
                        patient_photo: data.patient_photo,
                        doctor_id: data.doctor_id ,
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
                    booking,
                    error: null
                }
            } else {
                return {
                    booking: [],
                    error: null
                }
            }
        }else{
            throw {messgae: "Un Authorized"}
        }
    }catch(err){
        console.log('err: ', err)
    }
}

module.exports = {
    getAllBookApp
}