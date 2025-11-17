const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const { subClient } = require('../shared/redisClient');
const { walletEventChannel, jwtSecret } = require('../shared/config');

const PORT = process.env.WS_PORT || 4000;
const wss = new WebSocket.Server({ port: PORT });

const userSockets = new Map();

function addSocket(uid, ws) {
  const set = userSockets.get(uid) || new Set();
  set.add(ws);
  userSockets.set(uid, set);
}

function removeSocket(uid, ws) {
  const set = userSockets.get(uid);
  if (!set) return;
  set.delete(ws);
  if (!set.size) userSockets.delete(uid);
}

wss.on('connection', (ws) => {
  ws.once('message', (msg) => {
    try {
      const { type, token } = JSON.parse(msg);
      if (type === 'auth' && token) {
        const data = jwt.verify(token, jwtSecret);
        ws.userId = data.id;
        addSocket(data.id, ws);
        ws.send(JSON.stringify({ type: 'auth', ok: true }));
      } else ws.close();
    } catch {
      ws.close();
    }
  });

  ws.on('close', () => {
    if (ws.userId) removeSocket(ws.userId, ws);
  });
});

// Subscribe to wallet events
subClient.subscribe(walletEventChannel);
subClient.on('message', (ch, msg) => {
  if (ch !== walletEventChannel) return;
  const data = JSON.parse(msg);
  const sockets = userSockets.get(data.userId);
  if (!sockets) return;
  for (const s of sockets) {
    if (s.readyState === WebSocket.OPEN) s.send(JSON.stringify({ type: 'wallet_event', data }));
  }
});

console.log(`WebSocket running on ${PORT}`);
// container id : b069a4167900defc13efddf53331c517e6da10c26de168546ff701cbd64a512c 
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXIxMjMiLCJpYXQiOjE3NjI4NzQzNDF9.qM1XdcLS1Ja6M7wxPvFq185uL6En3MPZx3_wkWswvn4