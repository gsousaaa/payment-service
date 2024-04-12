const express = require('express')
const router = express.Router() 
const apiController = require("../controllers/apiController")


router.get('/transactions', apiController.getTransactions)
router.post('/transaction', apiController.createTransaction)


module.exports = router

