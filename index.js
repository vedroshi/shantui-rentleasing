const express = require('express')
const bodyParser = require('body-parser')
const {sequelize} = require('./utils/db_connect')
const cors = require('cors')

const rentRouter = require('./router/rentRouter')
const leasingRouter = require('./router/leasingRouter')

require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}))

const port = process.env.PORT || 3002

const RentModel = require('./models/rent.model')
const LeasingModel = require('./models/leasing.model')

app.use('/sewa', rentRouter)
app.use('/leasing', leasingRouter)

require('./utils/scheduler')

sequelize.sync()
.then(()=>{
    console.log("Database Synchronized")
}).catch((error)=>{
    console.log(`Error : ${error}`)
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})