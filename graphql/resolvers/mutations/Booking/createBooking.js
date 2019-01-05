var db = require('../../../../mysql_connection')

const createBooking = async (_, args, context) => {
    try{
        console.log('context: ', context.userAuth)
        if (!context.userAuth){
            throw {message: "Un Authorized"}
        }

        let patient_id = context.userAuth.id,
            doctor_id = args.input.doctor_id,
            clinic_id = args.input.clinic_id,
            symptom = args.input.symptom,
            time = args.input.time 

        let checkDoctorId = await db.execute(`
            select * from users where id = ? and role = ? and deleted_at is null
        `, [doctor_id, 1])

        console.log('checkDoctorId: ', checkDoctorId[0])

        if (checkDoctorId[0].length > 0){ // check doctor id is exist or not
            console.log('valid doctor')
            let checkClinicId = await db.execute(`
                select * from clinic where id = ? and deleted_at is null 
            `, [clinic_id])

            console.log('checkClinicId: ', checkClinicId[0])
            if (checkClinicId[0].length > 0){ // check clinic id is exist or not
                let checkTimeAppointment = await db.execute(`
                    select * from book_detail where time = ? and doctor_id = ? and deleted_at is null
                `, [time, doctor_id])
                console.log('checkTimeAppointment: ', checkTimeAppointment)
                if (checkTimeAppointment[0].length > 0){
                    throw {message: "doctor has appointment at this time"}
                }else{
                    let randomQueue =  Math.random().toString(36).substring(2);
                    console.log('randomQueue: ', randomQueue)
                    let insert = await db.execute(`
                        insert into book_detail 
                        (
                            book_id,
                            clinic_id,
                            patient_id,
                            doctor_id,
                            symptom,
                            time
                        )
                        values 
                        (
                            ?,?,?,?,?,?
                        )
                        `, [
                            randomQueue,
                            clinic_id,
                            patient_id,
                            doctor_id,
                            symptom,
                            time
                        ])

                    console.log('insert: ', insert)
                    if (insert[0].affectedRows === 1){
                        let id = insert[0].insertId

                        let getBackDataInserted = await db.execute(`
                            select * from book_detail where id = ? and deleted_at is null
                        `, [id])
                        console.log('getBackDataInserted: ', getBackDataInserted)
                        if (getBackDataInserted[0].length > 0){
                            let booking = await Promise.all(getBackDataInserted[0].map(async(data)=>{
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
                                    deleted_at: data.deleted_at,
                                }
                                return result
                            }))

                            return {
                                booking: booking[0],
                                error: null
                            }
                        }else{
                            return {
                                booking: [],
                                error: null
                            }
                        }
                    }else{
                        throw {message: "failed to insert data"}
                    }
                }
            }else{
                throw {message: "invalid clinic id"}
            }
        }else{
            throw { message: "invalid doctor id" }
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    createBooking
}