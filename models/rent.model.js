const { sequelize } = require('../utils/db_connect')
const { DataTypes, DATEONLY } = require('sequelize')

const RentModel = sequelize.define("Rent", {
    ID : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true,
        allowNull : false
    },
    Name : {
        type : DataTypes.STRING,
        allowNull : false,
    },
    Site : {
        type : DataTypes.STRING,
        allowNull : false
    },
    Start : {
        type : DataTypes.DATEONLY,
        allowNull : false
    },
    End : {
        type : DataTypes.DATEONLY,
        allowNull : false
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
        
    }
}, {
    tableName : 'sewa',
    createdAt : false,
    updatedAt : false
})

module.exports = RentModel