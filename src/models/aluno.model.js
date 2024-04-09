const mongoose = require('mongoose');
const alunoSchema = new mongoose.Schema({
  nome: {type: String, required: true},
  sobrenome: {type: String, required: true},
  idade: {type: Number, required: true},
  dni:{
    type: String,
    unique: true,
    required: true
  },
  curso: {type: String, required: true},
  nota: {type: Number, required: true},
})
module.exports = mongoose.model('alunos', alunoSchema)
