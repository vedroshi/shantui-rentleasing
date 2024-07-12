const RentService = require('../services/rentServices')

class RentController{
    async addRent(req, res, next){
        const data = req.body

        const service = new RentService()
        await service.addRent(data)
        .then((response)=>{
            res.status(200).json({
                success : true,
                message : "Rent Added"
            })
        }).catch((error)=>{
            next(error)
        })
    }

    async showRents(req, res, next){
        const service = new RentService()
        await service.showRents()
        .then((response)=>{
            res.status(200).json(response)  
        }).catch((error)=>{
            next(error)
        })
    }

    async editRent(req, res, next){
        const ID = req.params.id
        const data = req.body

        const service = new RentService()

        await service.editRent(ID, data)
        .then((response)=>{
            if(response){
                res.status(200).json({
                    success : true,
                    message : "Sewa Edited"
                })
            }
        }).catch((error)=>{
            next(error)
        })
    }

    async deleteRent(req, res, next){
        const Id = req.params.id
    
        const service = new RentService()
        
        await service.deleteRent(Id)
        .then((response)=>{
            if(response){
                res.status(200).json({
                    success: true,
                    message: "Sewa Deleted"
                })
            }
        }).catch((error)=>{
            next(error)
        })
    }

    async checkRent(req, res, next){
        const service = new RentService()

        await service.checkRentExpired()
        .then((response)=>{
            res.status(200).json({
                response
            })
        }).catch((error)=>{
            next(error)
        })
    }
}

module.exports = RentController