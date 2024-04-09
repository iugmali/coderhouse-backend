// Importa o módulo 'express' para criar o aplicativo Express
const express = require('express');
// Cria uma instância do aplicativo Express
const app = express();
// Importa os roteadores para usuários e pets
const usersRouter = require('./routes/usersRouter');
const petsRouter = require('./routes/petsRouter');
const alunosRouter = require('./routes/alunosRouter');

const mongoose = require ('mongoose')
// Middleware para analisar o corpo das requisições no formato JSON
// Isso permite que o Express analise os corpos das requisições HTTP com Content-Type 'application/json'
app.use(express.json());
// Middleware para capturar erros não tratados


mongoose.connect(process.env.MONGODB_CONNECTION)
.catch((error)=>{
    if(error){
        console.log('Não foi possível conectar ao banco de dados: '+ error)
        process.exit()
    }
})

// Roteador para lidar com as rotas relacionadas aos usuários
// Define que todas as requisições feitas para '/api/users' serão tratadas pelo roteador usersRouter
// Ou seja, todas as rotas definidas no usersRouter terão o prefixo '/api/users'
app.use('/api/users', usersRouter);

// Roteador para lidar com as rotas relacionadas aos pets
// Define que todas as requisições feitas para '/api/pets' serão tratadas pelo roteador petsRouter
// Ou seja, todas as rotas definidas no petsRouter terão o prefixo '/api/pets'
app.use('/api/pets', petsRouter);

app.use('/api/alunos', alunosRouter);

// Inicia o servidor Express e o faz escutar na porta 8080
app.listen(8081, () => {
    console.log(`Servidor rodando na porta 8081`);
});
