import './index.html';
import WSClient from './wsClient';
const wsClient = new WSClient(`ws://${location.host}/mega-chat-3/ws`);

//авторизация

const chatEntryBtn = document.querySelector('.login-submit');
const chatName = document.querySelector('.login-name-input');
const entryWindow = document.querySelector('#login');
const chatWindow = document.querySelector('#main');
const sendButton = document.querySelector('.send-button');
const userPhoto = document.querySelector('.user-photo');

const userName = document.querySelector('[data-role=user-name]');

const userList = document.querySelector('.user-list');
chatEntryBtn.addEventListener('click', (e) => {
  const newChatUser = document.createElement('div');
  const nameValue = chatName.value;
  // newChatUser.classList.add('.user-name');
  if (nameValue !== '') {
    entryWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
    userName.textContent = nameValue;
    userList.textContent = nameValue;
    userPhoto.style.backgroundImage = `url(/projects/chat/photos/${
      chatName.value
    }.png?t=${Date.now()})`;
    onMessage();
  }
  userList.appendChild(newChatUser);
  // chatName.value = '';
});

//отправка сообщения

const messagesСontainer = document.querySelector('.messages-container');
sendButton.addEventListener('click', (e) => {
  const messageInput = document.querySelector('.message-input');
  const newMessage = document.createElement('div');
  newMessage.textContent = messageInput.value;
  newMessage.classList.add('message-item', 'message-item-system');
  messagesСontainer.appendChild(newMessage);
  messagesСontainer.scrollTop = messagesСontainer.scrollHeight;
  // messageInput.value = '';
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, 0);
  const minutes = String(date.getMinutes()).padStart(2, 0);
  const time = `${hours}:${minutes}`;
  newMessage.classList.add('message-item');
  newMessage.innerHTML = `
  <div class="message-item-left">
      <div
      style="background-image: url(/mega-chat-3/photos/${
        chatName.value
      }.png?t=${Date.now()})" 
      class="message-item-photo" data-role="user-avatar" data-user=${
        chatName.value
      }></div>
  </div>
  <div class="message-item-right">
    <div class="message-item-header">
        <div class="message-item-header-name">${chatName.value}</div>
        <div class="message-item-header-time">${time}</div>
    </div>
    <div class="message-item-text">${messageInput.value}</div>
  </div>
  `;
});

//функция: сообщает всем о...

function onMessage(type, from, data) {
  console.log(`${chatName.value} вошел в чат`);
  if (type === 'hello') {
    messagesСontainer.addSystemMessage(`${chatName.value} вошел в чат`);
  } else if (type === 'user-list') {
    for (const item of data) {
      userList.add(item);
    }
  }
}

// перетаскивание фото

userPhoto.addEventListener('dragover', (e) => {
  if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
    e.preventDefault();
  }
});

userPhoto.addEventListener('drop', (e) => {
  const file = e.dataTransfer.items[0].getAsFile();
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.addEventListener('load', () => onUpload(reader.result));
  e.preventDefault();
});

function onUpload(data) {
  userPhoto.style.backgroundImage = `url(${data})`;
  fetch('/mega-chat-3/upload-photo', {
    method: 'post',
    body: JSON.stringify({
      name: chatName.value,
      image: data,
    }),
  });
}
