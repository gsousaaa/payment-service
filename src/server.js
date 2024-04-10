const express = require('express')
const dotenv = require('dotenv')
const router = require ('./routes/apiRoutes')
const cors = require('cors')

dotenv.config()

const server = express()

server.use(cors())

server.use(express.urlencoded({extended: true}))
server.use(express.json())
server.use('/', router)

server.listen(process.env.PORT, () => {
    console.log(`Server rodando na porta ${process.env.PORT}`)
})

