const express = require('express')
const router = express.Router() 
const apiController = require("../controllers/apiController")

router.get('/transactions', apiController.getTransactions)
router.post('/transaction', apiController.createTransaction)
router.get('/payables', apiController.getPayables)
router.get('/balance', apiController.getBalance)


module.exports = router

