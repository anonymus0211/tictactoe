'use strict';

const net = require('net');
const hat = require('hat');

const lobby = require('./services/lobby');
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
    lobby.leftSystem(socket)
  });
  
});

tcpServer.on('error', console.error);

tcpServer.listen(TCP_PORT, HOST);
