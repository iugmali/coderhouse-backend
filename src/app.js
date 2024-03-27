import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createServer } from 'node:http';
import { Server } from "socket.io";

import { engine } from "express-handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);
const messages = [];

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(join(__dirname, 'public')));

io.on('connection', (socket) => {
  socket.emit('messages', messages);
  socket.on('join', (name) => {
    messages.push({ author: 'ajhdjhaksdhaushdiua', message: `${name} entrou na sala` });
    io.emit('messages', messages);
    io.emit('join', name);
  });
  socket.on('leave', (name) => {
    messages.push({ author: 'ajhdjhaksdhaushdiua', message: `${name} saiu da sala` });
    io.emit('messages', messages);
  });
  socket.on('message', async (message) => {
    const encodedParams = new URLSearchParams();
    encodedParams.set('content', message.message);
    encodedParams.set('censor-character', '*');
    const url = 'https://neutrinoapi-bad-word-filter.p.rapidapi.com/bad-word-filter';
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'neutrinoapi-bad-word-filter.p.rapidapi.com'
      },
      body: encodedParams
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        messages.push(message);
        io.emit('messages', messages);
        return;
      }
      const result = JSON.parse(await response.text());
      console.log(result);
      message.message = result['censored-content'];
      messages.push(message);
      io.emit('messages', messages);
    } catch (error) {
      console.error(error);
    }
  });
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Chat' });
});

server.listen(8080, () => {
  console.log('Servidor iniciado na porta 8080');
});
