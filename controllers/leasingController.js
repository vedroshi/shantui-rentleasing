const leasingService = require('../services/leasingServices')

class LeasingController{
    async addLeasing(req, res, next){
        const data = req.body
        const service = new leasingService()

        await service.addLeasing(data)
        .then((response)=>{
            res.status(200).json({
                success : true,
                message : "Leasing Added"
            })
        }).catch((err)=>{
            next(err)
        })
    }

    async showLeasings(req, res, next){
        const service = new leasingService()

        await service.showLeasing()
        .then((response)=>{
            res.status(200).json(response)
        }).catch((err)=>{
            next(err)
        })
    }

    async editLeasing(req, res, next){
        const id = req.params.id
        const data = req.body
        const service = new leasingService()

        await service.editLeasing(id, data)
        .then((response)=>{
            if(response){
                res.status(200).json({
                    success : true,
                    message : "Leasing Edited"
                })
            }
        }).catch((error)=>{
            next(error)
        })
    }

    async deleteLeasing(req, res, next){
        const Id = req.params.id
        const service = new leasingService()

        await service.deleteLeasing(Id)
        .then((response)=>{
            if(response){
                res.status(200).json({
                    success : true,
                    message : "Leasing Deleted"
                })
            }
        }).catch((error)=>{
            next(error)
        })
    }

    async checkExpiredLeasing(req, res, next){
        const service = new leasingService()

        await service.checkLeasingExpired()
        .then((response)=>{
            res.status(200).json({
                response
            })
        }).catch((err)=>{
           next(err)
        })
    }

    async warningLeasing(req, res, next){
        const service = new leasingService()

        await service.leasingWarning()
        .then((response)=>{
            res.status(200).json({
                response
            })
        }).catch((error)=>{
            next(error)
        })
    }
}

module.exports = LeasingController