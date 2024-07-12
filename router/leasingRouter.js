const express = require('express')
const leasingController = require('../controllers/leasingController')

const controller = new leasingController()

const router = express.Router()

router.get('/', controller.showLeasings)

router.post('/create', controller.addLeasing)

router.patch('/edit/:id', controller.editLeasing)

router.delete('/delete/:id', controller.deleteLeasing)

router.patch('/check', controller.checkExpiredLeasing)

router.use((err, req, res, next)=>{
    res.status(500).json({
        success : false,
        error : err.message
    })
})

module.exports = router