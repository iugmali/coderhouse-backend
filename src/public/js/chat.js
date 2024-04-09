const chatbox = document.getElementById('chatbox');
const users = document.getElementById('users');
const sendButton = document.getElementById('send');
const messagesList = document.getElementById('messages');

let user;

Swal.fire({
  title: 'Seu e-mail',
  input: 'email',
  inputAttributes: {
    autocapitalize: 'off'
  },
  padding: '3rem',
  color: 'white',
  background: '#340634',
  backdrop: 'rgba(255,255,255,0.4)',
  allowOutsideClick: false,
  showCancelButton: false,
  confirmButtonText: 'ENTRAR',
  confirmButtonColor: '#351151',
  showLoaderOnConfirm: true,
  preConfirm: async (login) => {
    try {
      const response = await fetch('/chat/usercheck', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username: login})
      });
      if (response.status === 204) {
        socket.emit('join', login);
      } else if (response.status === 400) {
        Swal.showValidationMessage(`${login} não é um email válido`);
      } else if (response.status === 403) {
        Swal.showValidationMessage(`${login} já está conectado na sala`);
      }
    } catch (error) {
      Swal.showValidationMessage(error.message);
    }
  },
}).then((result) => {
  user = result.value;
  chatbox.focus();

  function sendMessage() {
    const message = chatbox.value.trim();
    if (!message) return;
    socket.emit('message', {user, message});
    chatbox.value = '';
    chatbox.focus()
  }

  sendButton.addEventListener('click', () => {
    sendMessage();
  });

  chatbox.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });

  socket.on('usersQty', (qty) => {
    users.innerHTML = qty === 1 ? `${qty} client conectado ao chat` : `${qty} clients conectados ao chat`;
  });

  socket.on('join', (name) => {
    Swal.fire({
      text: `${name} entrou na sala`,
      color: 'white',
      showConfirmButton: false,
      background: '#340634',
      timer: 3000,
      timerProgressBar: true,
      toast: true,
      position: 'top-right'
    });
  });

  socket.on('censored', (message) => {
    Swal.fire({
      text: `A sua mensagem "${message}" foi censurada`,
      color: 'white',
      showConfirmButton: false,
      background: '#340634',
      timer: 1500,
      timerProgressBar: true,
      toast: true,
      position: 'top-right'
    });
  });

  function addMessage (message) {
    const msgElem = document.createElement('div');
    msgElem.className = 'message';
    msgElem.innerHTML = message.user === 'iugmali-webchat-server'
      ? `<span class="system">${message.message}</span>`
      : `<strong>${message.user}:</strong> ${message.message}`;
    messagesList.appendChild(msgElem);
    messagesList.scrollTop = messagesList.scrollHeight;
  }

  socket.on('messages', (messages) => {
    messagesList.innerHTML = '';
    messages.forEach(message => {
      addMessage(message);
    });
  });

  socket.on('message', (message) => {
    addMessage(message);
  });
});
