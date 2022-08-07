import './index.html';
import WS from './ws.mjs';

//авторизация

const chatEntryBtn = document.querySelector('.login-submit');
const chatName = document.querySelector('.login-name-input');
const entryWindow = document.querySelector('#login');
const chatWindow = document.querySelector('#main');
const sendButton = document.querySelector('.send-button');

chatEntryBtn.addEventListener('click', (e) => {
  const userList = document.querySelector('.user-list');
  const newChatUser = document.createElement('div');
  const nameValue = chatName.value;
  newChatUser.classList.add('.user-name');
  if (nameValue !== '') {
    entryWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
    const userName = document.querySelector('[data-role=user-name]');
    userName.textContent = nameValue;
    userList.textContent = nameValue;
    // const socket = new WebSocket('ws:/localhost:2000');

    // socket.onopen = function () {
    //   const ws = new WS('client', socket).ws;

    //   ws.subscribe('user:connect', (data) => {
    //     console.log(data);
    //   });

    //   ws.subscribe('message:hello', (data) => {
    //     console.log(data);
    //   });
    // };
    onMessage(type, from, data );
  }
  userList.appendChild(newChatUser);
  // chatName.value = '';
});

//отправка сообщения

sendButton.addEventListener('click', (e) => {
  const messageInput = document.querySelector('.message-input');
  const messagesСontainer = document.querySelector('.messages-container');
  const newMessage = document.createElement('div');
  newMessage.textContent = messageInput.value;
  messagesСontainer.appendChild(newMessage);
  // messageInput.value = '';
});

//функция: сообщает всем о...

function onMessage({ type, from, data }) {
  // console.log(type, from, data);

  if (type === 'user:connect') {
    // this.ui.userList.add(from);
    messagesСontainer.addSystemMessage(`${chatName.value} вошел в чат`);
  }
  // else if (type === 'user-list') {
  //   for (const item of data) {
  //     this.ui.userList.add(item);
  //   }
  // } else if (type === 'bye-bye') {
  //   this.ui.userList.remove(from);
  //   this.ui.messageList.addSystemMessage(`${from} вышел из чата`);
  // } else if (type === 'text-message') {
  //   this.ui.messageList.add(from, data.message);
  // } else if (type === 'photo-changed') {
  //   const avatars = document.querySelectorAll(
  //     `[data-role=user-avatar][data-user=${data.name}]`
  // );

  // }
}
