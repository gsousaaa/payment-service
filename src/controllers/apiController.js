const Payable = require("../models/Payable");
const Transaction = require("../models/Transaction")
const { addDays } = require('date-fns');


// Função para verificar se o numero do cartão é válido e está no formato correto usando o algoritmo de luhn
const isValidCardNumber = (num) => {
    num = num.replace(/\s/g, '')
    const arr = num
        .split('')
        .reverse()
        .map(x => Number.parseInt(x));
    const lastDigit = arr.shift();
    let sum = arr.reduce(
        (acc, val, i) =>
            i % 2 !== 0 ? acc + val : acc + ((val *= 2) > 9 ? val - 9 : val),
        0
    );
    sum += lastDigit;
    return sum % 10 === 0;
};

function isValidExpirationDate(expirationDate) {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    return regex.test(expirationDate)
}

//Função para extrair os ultimos 4 digitos  de um numero de cartão
const card4Digits = (card_number) => {
    let cardNumber = card_number.replace(/\s/g, '')
    let last4Digits = cardNumber.slice(-4)

    return last4Digits;
}


module.exports = {
    createTransaction: async (req, res) => {
        let
            {
                amount,
                description,
                payment_method,
                card_number,
                card_name,
                card_expiration_date,
                card_cvv
            } = req.body

        let last4Digits

        try {
            if (!amount || !description || !payment_method || !card_number || !card_name || !card_expiration_date || !card_cvv) {
                return res.status(404).json({ error: 'Preencha todos os campos' })
            }

            if (card_cvv.toString().length > 3) {
                return res.status(404).json({ error: 'CVV inválido' })
            }

            if (isValidCardNumber(card_number) && card_number.length > 4 && card_number.length === 16) {
                last4Digits = card4Digits(card_number)
            } else {
                return res.status(404).json({ error: 'Numero de cartão inválido' })
            }

            if(!isValidExpirationDate(card_expiration_date)) {
                return res.status(404).json({error: 'Data de expiração inválida'})
            }

            let transactionObj = {
                amount,
                description,
                payment_method,
                card_number: last4Digits,
                card_name,
                card_expiration_date,
                card_cvv
            }

            let newTransaction = await Transaction.create(transactionObj)

            if (newTransaction.payment_method === 'debit_card') {
                let fee = 0.97

                await Payable.create({
                    status: 'paid',
                    amount: (newTransaction.amount * fee),
                    payment_date: newTransaction.created_transaction,
                    transaction_id: newTransaction.id
                })
            }

            if (newTransaction.payment_method === 'credit_card') {
                let fee = 0.95
                let paymentDate = addDays(newTransaction.created_transaction, 30)

                await Payable.create({
                    status: 'waiting_funds',
                    amount: (newTransaction.amount * fee),
                    payment_date: paymentDate,
                    transaction_id: newTransaction.id
                })
            }


            res.status(201).json({message: "Transação criada com sucesso"})

        } catch (err) {
            return res.status(500).json({ error: err })
        }

    },

    getTransactions: async (req, res) => {
        let transactions = await Transaction.findAll()
        if (!transactions) {
            return res.status(404).json({ error: 'Nenhuma transação foi encontrada' })
        }


        res.status(200).json(transactions)
    },


    getPayables: async (req, res) => {
        try {
            let payables = await Payable.findAll({
                include: [{
                    model: Transaction,
                    attributes: ['description']
                }]
            });

            if (!payables) {
                return res.status(404).json({ error: 'Nenhuma informação foi encontrada' })
            }

            return res.status(200).json(payables)

        } catch (err) {
            return res.status(500).json({ error: err });

        }
    },


    getBalance: async (req, res) => {
        try {
            let paidPayables = await Payable.sum('amount', {
                where: {
                    status: 'paid'
                }
            })

            let waitingFundsPayables = await Payable.sum('amount', {
                where: {
                    status: 'waiting_funds'
                }
            })

            let avaliableBalance = paidPayables
            let waintingFundsBalance = waitingFundsPayables

            res.status(200).json({
                avaliable_balance: avaliableBalance,
                waiting_funds_balance: waintingFundsBalance
            })

        } catch (err) {
            res.status(500).json({ error: err })
        }
    }
}


