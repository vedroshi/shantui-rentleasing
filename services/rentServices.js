const { Op } = require('sequelize')
const RentModel = require('../models/rent.model')
const { sequelize } = require('../utils/db_connect')


const { convertDate, getDateObj } = require('../utils/date')
const { default: axios } = require('axios')

class RentService{
    async addRent(data){
        const transaction = sequelize.transaction(async(t)=>{
            try { 
                await RentModel.create({
                    Name : data.Name,
                    Site : data.Site,
                    Start : data.Start,
                    End : data.End,
                    Payment_Due : data.Payment_Due,
                    Nominal : data.Nominal,
                    Info : data.Info
                }, {
                    transaction : t
                })
            }catch(error){
                t.rollback()
                throw error
            }
        })

        return transaction
    }
    
    async showRents(){
        try{
            const rents = await RentModel.findAll({})
            return rents
        }catch(error){
            throw error
        }
    }

    async editRent(ID, data){
        try{
            const changes = await RentModel.update({
                Name : data.Name,
                Site : data.Site,
                Start : data.Start,
                End : data.End,
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

    async deleteRent(ID){
        try{
            const deleted = await RentModel.destroy({
                where : {
                    ID : ID
                },
                limit : 1
            })
            return deleted
        }catch(error){
            throw error
        }
    }

    async checkRentExpired(){
        const transaction = sequelize.transaction(async (t) =>{
            try{
                const updateLog = []
                // Find expired Rent but the contract is not expired
                const listRent = await RentModel.findAll({
                    where : {
                        Payment_Due : {
                            [Op.lte] : new Date()
                        },
                        End : {
                            [Op.gt] : new Date()
                        }
                    },
                    transaction : t
                })
    
                if(listRent){
                    for(const item of listRent){
                        // Get new Payment Date to next month
                        const newPaymentDate = getDateObj(item.Payment_Due)
                        newPaymentDate.setMonth(newPaymentDate.getMonth() + 1)
                        
                       // Update Payment_Due
                        await RentModel.update({
                                Payment_Due : convertDate(newPaymentDate, "yyyy-MM-DD")
                        }, {
                        where : {
                            ID : item.ID
                        },
                        transaction : t
                       })

                       // Add Notification
                       await axios.post(`${process.env.KARYAWANURL}/notif/create`, {
                        Title : `Sewa - ${item.Name}`,
                        Description : `${item.Info} Sudah Jatuh Tempo dan Lanjut ke Bulan Selanjutnya`,
                        IsRead : 0
                       }).catch((err)=>{
                        throw err
                       })

                       // Update Log
                       updateLog.push({
                        ID : item.ID, 
                        message : "Payment Date Updated"
                       })
                    }
                }
                return updateLog
            }catch(error){
                throw error
            }
        })
        return transaction
    }
}

module.exports = RentService