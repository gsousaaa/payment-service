const Transaction = require("../models/Transaction")


// Função para verificar se o numero do cartão é válido e está no formato correto
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
                card_name, card_expiration_date,
                card_cvv
            } = req.body

        try {
            if (!amount || !description || !payment_method || !card_name || !card_expiration_date || !card_cvv) {
                return res.status(404).json({ error: 'Preencha todos os campos' })
            }

            let last4Digits
            if (isValidCardNumber(card_number)) {
                last4Digits = card4Digits(card_number)
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

            await Transaction.create(transactionObj)
            res.status(201).send("Transação criada com sucesso")

        } catch (error) {
            return res.status(404).json({ error })
        }

    },
}


