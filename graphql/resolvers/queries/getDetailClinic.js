var db = require('../../../mysql_connection')

const getDetailClinic = async (_, args, context) => {
    try{
        let id = args.id

        let getDataClinicDetail = await db.execute(`
            select * from clinic where deleted_at is null 
            and id = ?
        `, [id])

        console.log('getDataClinicDetail: ', getDataClinicDetail)

        if (getDataClinicDetail[0].length > 0){
            let clinic = await Promise.all(getDataClinicDetail[0].map(async(data)=>{
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
                clinic: clinic[0],
                error: null
            }
        }else{
            throw {message: 'invalid id'}
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    getDetailClinic
}