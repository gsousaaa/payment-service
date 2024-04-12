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
    console.log("Número do cartão sem espaços:", cardNumber);
    console.log(cardNumber.length)
    if (!(isValidCardNumber(cardNumber)) || cardNumber.length < 4) {
        console.error('Número de cartão inválido')
        return;
    }

    let last4Digits = cardNumber.slice(-4)

    return last4Digits;
}

let numeroCartao = '4485 2757 4230 8327'
let ultimos = card4Digits(numeroCartao)
console.log(ultimos)

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

    },
}


