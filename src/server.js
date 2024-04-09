import cors from 'cors';
import express, { urlencoded } from 'express';
import dotenv from 'dotenv';

dotenv.config()

const server = express()

server.use(cors())

server.use(urlencoded({extended: true}))
server.use(express.json())

