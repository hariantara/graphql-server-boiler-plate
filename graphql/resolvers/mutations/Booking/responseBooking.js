var db = require('../../../../mysql_connection') 
var gcm = require('node-gcm');

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

                    let PATIENT_KEY = process.env.PATIENT 

                    let doctorName = await db.execute(`select * from users where id = ? and deleted_at is null`, [booking[0].doctor_id])

                    let doc_name = doctorName[0][0].name

                    let token = await db.execute(`select * from fcm where patient_id = ? `, [booking[0].patient_id])

                    let patientDeviceToken = token[0][0].token

                    var sender = new gcm.Sender(PATIENT_KEY);

                    var message = new gcm.Message({
                        // "to":"fQblBr5Ms-U:APA91bGwxmTUnILPB0YKcaA6t1kBehonF1ztygG0JAMcnsitizEOLc_zyMMY1UOD7v8svq2moIeTyTaMfAr5hEuH4VvQrDgc5fVvU1Ue319UuVRVjrTGBSRUlOGr1X5JjsC4WgoibIcYoehAV54GaEuDixQ2d1sq-A",
                        "content_available": true,
                        "sound": "default",
                        "icon": "ic_notif",
                        "priority": "high",
                        "notification": {
                            "title": `${doctorName[0][0].name} Has Response your Appointment`,
                            "body": `Doctor ${doctorName[0][0].name} has ${booking[0].status}`,
                            "click_action": "appointment"
                        },
                        "data": {
                            "id_appointment": `test`,
                            "id_doctor": `test`,
                            "id_patient": `test`,
                            "speciality": `test`,
                            "speciality_id": `test`
                        }
                    });

                    var registrationTokens = [];
                    registrationTokens.push(patientDeviceToken)

                    sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
                        if (err) console.error(err);
                        else console.log(response);
                    });

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