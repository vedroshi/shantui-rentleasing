const moment = require('moment')

// Convert yyyy-mm-dd to Date Object
const getDateObj = (datestring) =>{
    const [year, month, date] = datestring.split('-')
    const dateObj = new Date(year, month - 1, date)
    return dateObj
}

// Convert DateObj to specific format string
const convertDate = (date, format) =>{
    // Parameters
    // date : Date(),
    // format : "dd/mm/yyyy | yyyy-mm-dd"
   
    const datestring = moment(date).format(format)
    return datestring
}

module.exports = {
    getDateObj,
    convertDate
}

