const express = require('express')
const rentController = require('../controllers/rentController')

const router = express.Router()
const controller = new rentController()

router.get('/' , controller.showRents)
router.post('/create' , controller.addRent)
router.patch('/edit/:id', controller.editRent)
router.delete('/delete/:id', controller.deleteRent)

router.patch('/check', controller.checkRent)

router.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(500).json({ 
      success : false,
      error: err.message 
    });
  });
  

module.exports = router