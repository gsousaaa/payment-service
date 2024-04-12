const { DataTypes } = require('sequelize')
const sequelize = require("../instances/mysql")
const Payable = require("../models/Payable")

const Transaction = sequelize.define('Transaction', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('debit_card', 'credit_card'),
        allowNull: false
    },
    card_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    card_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    card_expiration_date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    card_cvv: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_transaction: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    }
}, {
    tableName: 'transactions',
    timestamps: false
})

// Definindo a relação entre as tabelas
Transaction.hasMany(Payable, { foreignKey: 'transaction_id', allowNull: false});
Payable.belongsTo(Transaction, { foreignKey: 'transaction_id', allowNull: false });

sequelize.sync()
    .then(() => {
        console.log("Model sincronizado com sucesso")
    })
    .catch(error => {
        console.log(error)
    })

module.exports = Transaction

