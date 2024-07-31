const schedule = require('node-schedule')

const RentService = require('../services/rentServices')
const LeasingService = require('../services/leasingServices')

// Execute Everyday at 00:00, 09:00, and 17:00 
schedule.scheduleJob("0 0,10,17 * * *", async()=>{
    try{

        const rentService = new RentService()
        const leasingService = new LeasingService
    
        // Checking Expired Leasing and Rent
        const [warningRent, warningLeasing, expiredRent, expiredLeasing] = await Promise.all([
            //Add Notification
            rentService.rentWarning(),
            leasingService.leasingWarning(),

            // Check and Update Expired Rent
            rentService.checkRentExpired(),
    
            // Check and Update Expired Leasing
            leasingService.checkLeasingExpired()
        ])
    
        const paymentDueExpired = [...warningRent, ...warningLeasing, ...expiredRent, ...expiredLeasing]
    
        console.log(paymentDueExpired)
        
    }catch(err){
        console.error(err)
    }
})