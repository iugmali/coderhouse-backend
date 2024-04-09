const express = require('express');
const alunoModel = require('../models/aluno.model');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    let users = await alunoModel.find();
    res.send({ result: 'success', payload: users });
  } catch (error) {
    console.log("Cannot get users com mongoose: " + error);
    res.status(404).json({ error: 'Erro ao buscar usuários' });
  }
});

router.post('/', async (req, res) => {
  try {
    let aluno = req.body;
    let result = await alunoModel.create(aluno);
    res.status(201).json({ status: 'success', payload: result });

  } catch (error) {
    if (error.name === "ValidationError") {
      let errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json(errors);
    }
    switch (error.code) {
      case 11000:
        res.status(400).json({ error: 'dni já cadastrado' });
        break;
      default:
        res.status(500).json({ error: 'Erro ao adicionar usuário no banco de dados' });
    }
  }
});

module.exports = router;
