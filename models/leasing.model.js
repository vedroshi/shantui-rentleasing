const {sequelize} = require('../utils/db_connect')
const {DataTypes} = require('sequelize')

const LeasingModel = sequelize.define("Leasing" , {
    ID: {
        type : DataTypes.INTEGER,
        allowNull : false,
        primaryKey : true,
        autoIncrement : true
    },
    Name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    Payment_Due : {
        type : DataTypes.DATEONLY,
        allowNull : false
    },
    Nominal : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    Info : {
        type : DataTypes.TEXT,
        allowNull : false
    }
}, {
    tableName : 'leasing',
    createdAt : false,
    updatedAt : false,
})

module.exports = LeasingModel