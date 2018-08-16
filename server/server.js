'use strict';

const net = require('net');
const WebSocket = require('ws');

const lobby = require('./services/lobby');
const gameCollection = require('./services/gameCollection');
const handler = require('./services/handler');

const HOST = '127.0.0.1';
const TCP_PORT = 1337;
const WS_PORT = 8081;


/**
 * tcpServer
 */
const tcpServer = net.createServer(function(socket) {
  lobby.addNew(socket);
  
  // Bind is no needed but easier to understand what's going on in the handler
  socket.on('data', handler.bind(socket));

  socket.on('end', function() {
    // cleanup game
    gameCollection.removeByPlayer(socket);
    // cleanup lobby
    lobby.leftSystem(socket);
  });

  socket.on('error', (err) => {
    console.log('socket', socket.id);
    lobby.leftSystem(socket);
    // cleanup game
    gameCollection.removeByPlayer(socket);
    console.log(err);
  });
});

tcpServer.on('error', () => {
  console.error('error');
});

tcpServer.listen(TCP_PORT, HOST, () => {
  console.log(`TCP server listening on ${HOST}:${TCP_PORT}`);
});


const wss = new WebSocket.Server({
  port: WS_PORT,
}, () => {
  console.log(`Websocket server listening on ${HOST}:${WS_PORT}`);
});

wss.on('connection', function(socket) {
  lobby.addNew(socket);
 
  socket.on('message', handler.bind(socket));

  socket.on('close', () => {
    // cleanup game
    gameCollection.removeByPlayer(socket);
    // cleanup lobby
    lobby.leftSystem(socket);
  });

  socket.on('error', (err) => {
    console.log('socket', socket.id);
    lobby.leftSystem(socket);
    // cleanup game
    gameCollection.removeByPlayer(socket);
    console.log(err);
  });

});


