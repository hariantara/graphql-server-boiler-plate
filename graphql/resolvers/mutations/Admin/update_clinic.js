var db = require('../../../../mysql_connection')
var argon2 = require('argon2')
var axios = require('axios')

const updateClinic = async (_, args, context) => {
    try{
        let key = process.env.GEOCODING
        let clinic_name = args.input.clinic_name,
            clinic_mobile = args.input.clinic_mobile,
            clinic_address = args.input.clinic_address,
            clinic_email = args.input.clinic_email,
            id = args.input.id

        let checkDataExist = await db.execute(`select * from clinic where id = ?`, [id])
        console.log('checkDataExist: ', checkDataExist)
        if (checkDataExist[0].length === 0){
            throw {message: "cant update, data not found"}
        }

        let mapsGenerating = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${clinic_address}&key=${key}`)
        console.log('mapsGenerating: ', mapsGenerating.data.results[0])

        if (mapsGenerating.data.results.length > 0) {
            // console.log('bounds: ', mapsGenerating.data.results[0].geometry.bounds.northeast)
            let geometry = mapsGenerating.data.results[0].geometry

            let location = {
                lat: mapsGenerating.data.results[0].geometry.location.lat,
                lng: mapsGenerating.data.results[0].geometry.location.lng
            }

            let viewport = {
                northeast: {
                    lat: mapsGenerating.data.results[0].geometry.viewport.northeast.lat,
                    lng: mapsGenerating.data.results[0].geometry.viewport.northeast.lng,
                },
                southeast: {
                    lat: mapsGenerating.data.results[0].geometry.viewport.southwest.lat,
                    lng: mapsGenerating.data.results[0].geometry.viewport.southwest.lng,
                }
            }

            let place_id = mapsGenerating.data.results[0].place_id
            let address = mapsGenerating.data.results[0].formatted_address

            let dataQuery = [
                clinic_name,
                clinic_mobile,
                address,
                clinic_email,
                location.lat,
                location.lng,
                viewport.northeast.lat,
                viewport.northeast.lng,
                viewport.southeast.lat,
                viewport.southeast.lng,
                place_id,
                id
            ]

            let update = `
                update clinic 
                set clinic_name = ?,
                clinic_mobile = ?,
                clinic_address = ?,
                clinic_email = ?,
                clinic_lat = ?,
                clinic_long = ?,
                northeast_lat = ?,
                northeast_lng = ?,
                southwest_lat = ?,
                southwest_lng = ?,
                place_id = ?
                where id = ?
            `

            let runUpdate = await db.execute(update, dataQuery)
            console.log('runUpdate: ', runUpdate)

            if (runUpdate[0].affectedRows === 1){
                let getBackUpdatedData = await db.execute(`select * from clinic where id = ?`, [id])
                console.log('getBackUpdatedData: ', getBackUpdatedData)

                if (getBackUpdatedData[0].length > 0){
                    let clinic = await Promise.all(getBackUpdatedData[0].map(async (data) => {
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
                    throw {message: "failed to get updated data, please try again"}
                }
            }else{
                throw {message: "connection problem while update, please try again"}
            }
        }else{
            throw { message: "Google API problem, please check limit API Key" }
        }
    }catch(err){
        console.log('err: ', err)
        return {
            error: err.message
        }
    }
}

module.exports = {
    updateClinic
}