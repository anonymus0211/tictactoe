'use strict';

const net = require('net');

const lobby = require('./services/lobby');
const gameCollection = require('./services/gameCollection');
const handler = require('./services/handler');

const HOST = '127.0.0.1';
const TCP_PORT = 1337;


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
  console.log(`Server listening on ${HOST}:${TCP_PORT}`);
});

