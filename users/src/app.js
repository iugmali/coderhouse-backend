const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [];

app.get('/api/user', (req, res) => {
  res.send(users);
});

app.post('/api/user', (req, res) => {
  const enteredUser = req.body;
  if (!enteredUser.first_name || !enteredUser.last_name) {
    res.status(400).send({ status: "error", error: 'Valores Incompletos' });
    return;
  }
  const lastId = users.length > 0 ? users[users.length - 1].id : 0;
  const user = {
    id: lastId + 1,
    first_name: enteredUser.first_name,
    last_name: enteredUser.last_name
  };
  users.push(user);
  res.status(201).send({ status: "created", message: "Usuário adicionado com sucesso" });
});

app.get('/api/user/:id', (req, res) => {
  const user = users.find(u => u.id === +req.params.id);
  if (!user) {
    res.status(404).send({status: "error", error: "Usuário não encontrado"});
    return;
  }
  res.send(user);
});

app.patch('/api/user/:id', (req, res) => {
  const enteredUser = req.body;
  if (!enteredUser.first_name || !enteredUser.last_name) {
    res.status(400).send({ status: "error", error: 'Valores Incompletos' });
    return;
  }
  let index;
  const user = users.find((u, i) => {
    index = i;
    return u.id === +req.params.id;
  });
  if (!user) {
    res.status(404).send({status: "error", error: "Usuário não encontrado"});
    return;
  }
  const updatedUser = {
    id: user.id,
    first_name: enteredUser.first_name,
    last_name: enteredUser.last_name
  };
  users.splice(index, 1, updatedUser);
  res.send({status: "success", message: "Usuário atualizado com sucesso"});
});

app.delete('/api/user/:id', (req, res) => {
  const index = users.findIndex(u => u.id === +req.params.id);
  if (index === -1) {
    res.status(404).send({status: "error", error: "Usuário não encontrado"});
    return;
  }
  users.splice(index, 1);
  res.status(204).send();
});

app.listen(8080, () => console.log('Server running on port 8080'));
