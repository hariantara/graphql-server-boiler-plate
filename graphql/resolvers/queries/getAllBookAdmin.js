var db = require('../../../mysql_connection')

const getAllBookAdmin = async (_, args, context) => {
    try{
        let getAllBookData = await db.execute(`
            select * from book_detail where deleted_at is null ORDER BY coalesce(updated_at, created_at) DESC, id DESC
        `)
        console.log('getAllBookData: ', getAllBookData[0])
        if (getAllBookData[0].length > 0){
            return {
                booking: getAllBookData[0],
                error: null
            }
        }else{
            return {
                booking: [],
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
    getAllBookAdmin
}