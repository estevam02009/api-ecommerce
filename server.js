require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(express.json()); // Para parsear JSON do corpo da requisição

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB: ', err));

// Conexão com o Redis
const redisClient = new Redis(process.env.REDIS_URI);
redisClient.on('connect', () => console.log('Connected to Redis server!'));
redisClient.on('error', err => console.error('Erro ao conectar ao Redis Server!', err));

// Exportar o cliente Redis para ser usado em outros modulos
app.set('redisClient', redisClient);

// Rotas serão importadas aqui.
app.get('/', (req, res) => {
    res.send('API de E-commerce funcionando na Redis Server!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
})