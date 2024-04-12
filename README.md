# Api para Processamento de Pagamentos 💳💵

### Visão Geral

O projeto consiste em desenvolver um serviço back-end para processamento de transações de pagamento e gerenciamento de recebíveis para clientes de um serviço de processamento de pagamentos. O serviço será desenvolvido em Node.js, utilizando o framework Express para a construção de APIs RESTful. O banco de dados utilizado será o MySQL, e a interação com o banco será feita por meio do ORM Sequelize. Além disso, estão previstas implementações futuras de testes automatizados.

### Entidades e relacionamentos

O projeto possui duas entidades principais:
1. **Transaction**: Representa as informações da compra, incluindo dados do cartão, valor e descrição da transação.
2. **Payable**: Representa os recebíveis que serão pagos ao cliente. Cada transação gera um ou mais recebíveis, dependendo do método de pagamento utilizado.

- A tabela `transactions` tem uma relação de um para muitos com a tabela `payables`, onde uma transação pode gerar um ou mais recebíveis.
- A chave estrangeira `transaction_id` na tabela `payables` estabelece essa relação.

### Regras de Negócio

- O serviço armazena e retorna apenas os últimos 4 dígitos do número do cartão, devido à sensibilidade dessa informação.
- Os recebíveis (payables) são criados com base nas seguintes regras:
  - Transações com cartão de débito:
    - O recebível é criado com status 'paid', indicando que o cliente já recebeu o valor.
    - A data de pagamento é definida como a data da criação da transação (D+0).
    - É aplicada uma taxa de processamento de 3% sobre o valor da transação.
  - Transações com cartão de crédito:
    - O recebível é criado com status 'waiting_funds', indicando que o cliente receberá o valor no futuro.
    - A data de pagamento é definida como a data da criação da transação + 30 dias (D+30).
    - É aplicada uma taxa de processamento de 5% sobre o valor da transação.
- O saldo disponível (available_balance) é calculado somando todos os recebíveis com status 'paid'.
- O saldo a receber (waiting_funds_balance) é calculado somando todos os recebíveis com status 'waiting_funds'.

### Funcionalidades

#### 1. Processamento de Transações

- **Rota:** POST /transaction
  - Esta rota permite a criação de uma nova transação.
  - Requisição:
    - Parâmetros obrigatórios:
      - amount: Valor da transação.
      - description: Descrição da transação.
      - payment_method: Método de pagamento (debit_card ou credit_card).
      - card_number: Número do cartão.
      - card_name: Nome do portador do cartão.
      - card_expiration_date: Data de validade do cartão.
      - card_cvv: Código de verificação do cartão (CVV).
  - Resposta:
    - Status 201 (Created) em caso de sucesso.
    - Status 404 (Not Found) se algum parâmetro obrigatório não for fornecido ou se o CVV for inválido.
  - Exemplo de resposta (sucesso):
    ```
    "Transação criada com sucesso"
    ```

#### 2. Consulta de Transações

- **Rota:** GET /transactions
  - Esta rota permite recuperar todas as transações criadas.
  - Resposta:
    - Retorna uma lista de todas as transações com seus detalhes.
  - Exemplo de resposta:
    ```json
    [
      {
        "id": 1,
        "amount": 400,
        "description": "mouse",
        "payment_method": "debit_card",
        "card_number": "8327",
        "card_name": "Fulano",
        "card_expiration_date": "09/30",
        "card_cvv": 555,
        "created_transaction": "2024-04-12T18:25:57.000Z"
      },
      {
        "id": 2,
        "amount": 400,
        "description": "teclado",
        "payment_method": "credit_card",
        "card_number": "8327",
        "card_name": "Fulano",
        "card_expiration_date": "09/30",
        "card_cvv": 555,
        "created_transaction": "2024-04-12T18:26:45.000Z"
      },
    ]
    ```

#### 3. Consulta de Recebíveis

- **Rota:** GET /payables
  - Esta rota permite consultar todos os recebíveis gerados a partir das transações.
  - Resposta:
    - Retorna uma lista de todos os recebíveis com informações adicionais sobre a transação associada.
  - Exemplo de resposta:
    ```json
    [
        {
            "id": 1,
            "status": "paid",
            "amount": 388,
            "payment_date": "2024-04-12T18:25:57.000Z",
            "transaction_id": 1,
            "Transaction": {
                "description": "mouse"
            }
        },
        {
            "id": 2,
            "status": "waiting_funds",
            "amount": 380,
            "payment_date": "2024-05-12T18:26:45.000Z",
            "transaction_id": 2,
            "Transaction": {
                "description": "teclado"
            }
        }
    ]
    ```

#### 4. Consulta de Saldo

- **Rota:** GET /balance
  - Esta rota permite consultar o saldo disponível e o saldo a receber para o cliente.
  - Resposta:
    - Retorna o saldo disponível (payables paid) e o saldo a receber (payables waiting_funds).
  - Exemplo de resposta:
    ```json
    {
        "avaliable_balance": 388,
        "waiting_funds_balance": 380
    }
    ```


