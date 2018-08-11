'use strict';

const hat = require('hat');
const { sendResponse } = require('../helpers/response');

let lobbyInstance = null;

class Lobby {
  constructor() {
    this.clients = [];
    this.guestId = 0;
  }
  
  addNew(socket) {
    socket.nickName = `guest${++this.guestId}`;
    socket.id = hat();
    console.log(socket.nickName);
    console.log(socket.id);
    this.add(socket);
  }

  add(socket) {
    this.clients.push(socket);
    this.broadcast(socket, `${socket.nickName} join to system`);
    this.broadcastLobbyChange(socket);
  }

  remove(socket) {
    this.clients.splice(this.clients.indexOf(socket), 1);
  }

  leftSystem(socket) {
    this.remove(socket);
    this.broadcastLobbyChange(socket);
    this.broadcast(socket, `${socket.nickName} left the system`);
  }

  lobbyInfo(socket) {
    return this.clients.filter(c => c.id!=socket.id).map(c => { 
      return { id: c.id, nickName: c.nickName }
    });
  }

  sendLobbyInfo(socket) {
    sendResponse(socket, this.lobbyInfo(socket))
  }

  broadcast(socket,info) {
    this.clients.filter(c => c.id != socket.id).forEach( client => {
      sendResponse(client, { message: info });
    });
  }
  
  broadcastLobbyChange(socket) {
    this.clients.filter(c => c.id != socket.id ).forEach( client => {
      sendResponse(client, this.lobbyInfo(client));
    });
  }
}

if (!lobbyInstance) {
  lobbyInstance = new Lobby();
}

module.exports = lobbyInstance;

