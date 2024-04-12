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


//Função para extrair os ultimos 4 digitos  de um numero de cartão
const card4Digits = (card_number) => {
    let cardNumber = card_number.replace(/\s/g, '')

    if (!(isValidCardNumber(cardNumber)) || cardNumber.length < 4 || cardNumber.length !== 16) {
        console.error('Número de cartão inválido')
        return;
    }

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

            if (isValidCardNumber(card_number) || card_number.length > 4 || card_number.length === 16) {
                last4Digits = card4Digits(card_number)
            } else {
                return res.status(404).json({ error: 'Numero de cartão inválido' })
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


            res.status(201).send("Transação criada com sucesso")

        } catch (err) {
            return res.status(404).json({ error: err })
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
    }
}


