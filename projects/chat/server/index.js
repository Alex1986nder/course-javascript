import { WebSocketServer } from 'ws';
import http from 'http';
import WS from '../ws.mjs';
const wss = new WebSocketServer({ noServer: true });

const server = http.createServer((req, res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

function onSocketConnect(client) {
  const ws = new WS('server', client).ws;

  ws.sendMessage('user:connect', {
    user: {
      name: `${chatName.value}`,
    },
  });

  ws.sendMessage('message:hello', {
    user: {
      name: `${chatName.value}`,
    },
  });

  ws.subscribe('user:connect', (data) => {
    console.log(data);
    ws.sendMessage('message:hello', {
      user: {
        name: `${chatName.value}`,
      },
    });
  });
}

server.listen(2000, () => {
  console.log('listen....');
});
