const Transaction = require("../models/Transaction")


// Função para verificar se o numero do cartão é válido e está no formato correto
const isValidCardNumber = (card_number) => {
    let cardNumber = card_number.replace(/\s/g, '')

    // Se a expressão não contém somente digitos, retornar falso
    if (!/^\d+$/.test(cardNumber)) {
        return false
    }

    let sum = 0
    let multiplier = 1
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10)

        /*Multiplicação alternada, os primeiros digitos mais a direita
        são multiplicados por 1, enquanto os da esquerda por 2 */
        digit *= multiplier
        if (digit > 9) {
            digit -= 9
        }

        sum += digit
        //Alternando o multiplicador
        multiplier = (multiplier === 1) ? 2 : 1
    }

    // O número do cartão é válido se a soma dos dígitos for múltiplo de 10
    return (sum % 10 === 0)
}


//Função para extrair os ultimos 4 digitos  de um numero de cartão
const card4Digits = (card_number) => {
   


}

module.exports = {
    createTransaction: async (req, res) => {
     
    },
}


