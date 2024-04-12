const { DataTypes } = require('sequelize')
const sequelize = require("../instances/mysql")

const Payable = sequelize.define('Payable', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.ENUM('paid', 'waiting_funds') ,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    }, 
    payment_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    transaction_id: {
        type: DataTypes.INTEGER,
        allowNull: false // Chave estrangeira agora é NOT NULL
    }
}, {
    tableName: 'payables',
    timestamps: false
})

sequelize.sync()
    .then(() => {
        console.log("Model sincronizado com sucesso")
    })
    .catch(error => {
        console.log(error)
    })

module.exports = Payable

