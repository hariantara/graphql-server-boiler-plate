var db = require('../../../mysql_connection')

const getAllClinic = async (_, args, context) => {
    try{
        let getAllDataClinic = await db.execute(`
            select * from clinic where deleted_at is null 
        `)

        console.log('getAllDataClinic: ', getAllDataClinic)

        if (getAllDataClinic[0].length > 0){
            let clinic = await Promise.all(getAllDataClinic[0].map(async(data)=>{
                let result = {
                    id: data.id,
                    clinic_name: data.clinic_name,
                    clinic_mobile: data.clinic_mobile,
                    clinic_address: data.clinic_address,
                    clinic_email: data.clinic_email,
                    location: {
                        lat: data.clinic_lat,
                        lng: data.clinic_long
                    },
                    viewport: {
                        northeast: {
                            lat: data.northeast_lat,
                            lng: data.northeast_lng
                        },
                        southwest: {
                            lat: data.southwest_lat,
                            lng: data.southwest_lng
                        }
                    },
                    place_id: data.place_id
                }

                return result 
            }))

            return {
                clinic,
                error: null
            }
        }else{
            return {
                clinic: [],
                error: null
            }
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    getAllClinic
}