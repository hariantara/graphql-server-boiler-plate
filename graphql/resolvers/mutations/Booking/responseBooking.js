var db = require('../../../../mysql_connection') 

const doctorResponseBooking = async (_, args, context) => {
    try{
        console.log('args: ', args)
        let book_id = args.book_id 
        let response = args.response

        let checkBookingId = await db.execute(`
            select * from book_detail where id = ? and deleted_at is null
        `,[book_id])

        console.log('checkBookingId: ', checkBookingId)
        if (checkBookingId[0].length > 0){
            let update = await db.execute(`
                update book_detail 
                set status=?
                where id = ?
            `, [response, book_id])

            console.log('update: ', update)
            if (update[0].affectedRows === 1){
                let getBackDataUpdated = await db.execute(`
                    select * from book_detail where id = ?
                `, [book_id])
                console.log('getBackDataUpdated: ', getBackDataUpdated)
                if (getBackDataUpdated[0].length > 0) {
                    let booking = await Promise.all(getBackDataUpdated[0].map(async (data) => {
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
                } else {
                    return {
                        booking: [],
                        error: null
                    }
                }
            }else{
                throw {message: "failed to update, please try again"}
            }
        }else{
            throw {message: "invalid booking id"}
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    doctorResponseBooking
}