const { Op } = require('sequelize')

const LeasingModel = require('../models/leasing.model')
const {seqeuelize, sequelize} = require('../utils/db_connect')
const { getDateObj, convertDate } = require('../utils/date')
const { default: axios } = require('axios')

class LeasingService{
    async addLeasing(data){
        try{
            const transaction = sequelize.transaction(async(t) =>{
                try{
                    const leasing = await LeasingModel.create({
                        Name : data.Name,
                        Payment_Due : data.Payment_Due,
                        Nominal : data.Nominal,
                        Info : data.Info
                    }, {
                        transaction : t
                    })

                    return leasing
                }catch(error){
                    throw error
                }
            })
            return transaction
        }catch(error){
            throw error
        }
    }

    async showLeasing(){
        try{
            const leasings = await LeasingModel.findAll({})
            return leasings
        }catch(error){
            throw error
        }
    }

    async editLeasing(ID, data){

        try{
            const changes = await LeasingModel.update({
                Name : data.Name,
                Payment_Due : data.Payment_Due,
                Nominal : data.Nominal,
                Info : data.Info
            }, {
                where : {
                    ID : ID
                }
            })
            
           return changes[0]
        }catch(error){
            throw error
        }
    }

    async deleteLeasing(ID){
        try{
            const deleted = await LeasingModel.destroy({
                where : {
                    ID, ID
                },
                limit: 1
            })
            return deleted
        }catch(error){
            throw error
        }
    }

    async checkLeasingExpired(){
        const transaction = sequelize.transaction(async (t) =>{
            try{
    
                const updateLog = []
                
                // Find the Expired Leasing but the contract is not end yet
                const listLeasing = await LeasingModel.findAll({
                    where : {
                        Payment_Due : {
                            [Op.lte] : new Date()
                        },
                    },
                    transaction : t
                })
    
                if (listLeasing){
                    for(const item of listLeasing){
                        const newPaymentDate = getDateObj(item.Payment_Due)
                        newPaymentDate.setMonth(newPaymentDate.getMonth() + 1)
                        
                        // Update new Payment Due
                        await LeasingModel.update({
                            Payment_Due : convertDate(newPaymentDate, "YYYY-MM-DD")
                        }, {
                            where : {
                                ID : item.ID
                            }
                        },{
                            transaction : t
                        })
    
                        // Add Notification
                        await axios.post(`${process.env.KARYAWANURL}/notif/create`, {
                            Title : `Leasing - ${item.Name}`,
                            Description : `${item.Info} Sudah Jatuh Tempo dan Lanjut ke Bulan Selanjutnya`
                        }).catch((error)=>{
                            throw error
                        })
    
                        updateLog.push({
                            ID : item.ID,
                            message : "Payment Date Updated"
                        })
                    }
                }
                return updateLog
            }catch(err){    
                throw err
            }
        })
        return transaction
    }

    async leasingWarning(){
        // Setup the last 7 days
        const dueDate = new Date()
        dueDate.setDate(dueDate.getDate() + 7)
        
        const transaction = await sequelize.transaction(async(t) =>{
            try{
                const warningLog = []
                const leasings = await LeasingModel.findAll({
                    where : {
                        Payment_Due : dueDate
                    },
                    transaction : t
                })

                // Stop Transaction
                if(leasings.length == 0){
                    return warningLog
                }

                if(leasings){
                    for(const leasing of leasings){
                        await axios.post(`${process.env.KARYAWANURL}/notif/create`, {
                            Title : `Leasing - ${leasing.Name}`,
                            Description : `${leasing.Info} Sudah Mau Jatuh Tempo`,
                            IsRead : 0
                        }).catch((err)=>{
                            throw err
                        })

                        warningLog.push({
                            ID : leasing.ID,
                            message : "Payment date is nearly due",
                            type : "Warning"
                        })
                    }
                }

                return warningLog
            }catch(error){
                t.rollback()
                throw error
            }
        })
        return transaction
    }
}

module.exports = LeasingService