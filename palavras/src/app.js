const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const palavras = [];

app.get('/api/frase', (req, res) => {
  res.send(palavras.join(' '));
});

app.get('/api/palavras/:pos', (req, res) => {
  const pos = req.params.pos;
  if (pos < 1 || pos > palavras.length) {
    res.status(404).send({status: "error", error: "Palavra não encontrada"});
    return;
  }
  res.send(palavras[pos - 1]);
});

app.post('/api/palavras', (req, res) => {
  const palavra = req.body.palavra;
  if (!palavra) {
    res.status(400).send({ status: "error", error: 'Valores Incompletos' });
    return;
  }
  palavras.push(palavra);
  res.status(201).send({ status: "created", message: "Palavra adicionada com sucesso" });
});

app.put('/api/palavras/:pos', (req, res) => {
  const pos = req.params.pos;
  const palavra = req.body.palavra;
  if (pos < 1 || pos > palavras.length) {
    res.status(404).send({status: "error", error: "Palavra não encontrada"});
    return;
  }
  if (!palavra) {
    res.status(400).send({ status: "error", error: 'Valores Incompletos' });
    return;
  }
  const palavraAnterior = palavras[pos - 1];
  palavras[pos - 1] = palavra;
  res.send({status: "atualizado", anterior: palavraAnterior, atualizado: palavra});
});

app.delete('/api/palavras/:pos', (req, res) => {
  const pos = req.params.pos;
  if (pos < 1 || pos > palavras.length) {
    res.status(404).send({status: "error", error: "Palavra não encontrada"});
    return;
  }
  const palavra = palavras.splice(pos - 1, 1);
  res.send({status: "removido", removido: palavra});
});

app.listen(8080, () => console.log('Server running on port 8080'));
