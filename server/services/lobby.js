'use strict';

const hat = require('hat');
const { sendResponse } = require('../helpers/response');
const commandList = require('../helpers/commandList');

let lobbyInstance = null;

class Lobby {
  constructor() {
    this.clients = [];
    this.guestId = 0;
  }
  
  addNew(socket) {
    socket.nickName = `guest${++this.guestId}`;
    socket.id = hat();
    console.log(`${socket.nickName} (${socket.id}) joined to server`);
    this._initInfo(socket);
    this.add(socket);
  }

  add(socket) {
    this.clients.push(socket);
    sendResponse(socket, commandList.backToLobby);
    this.broadcast(socket, `${socket.nickName} join to system`);
    this.broadcastLobbyChange(socket);
  }

  remove(socket) {
    const index  = this.clients.indexOf(socket);
    if(index >= 0) {
      this.clients.splice(index, 1);
    }
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
    sendResponse(socket, commandList.getLobby, this.lobbyInfo(socket));
  }

  broadcast(socket,info) {
    this.clients.filter(c => c.id != socket.id).forEach( client => {
      sendResponse(client, commandList.sysMessage, info);
    });
  }
  
  broadcastLobbyChange(socket) {
    this.clients.filter(c => c.id != socket.id ).forEach( client => {
      sendResponse(client, commandList.getLobby, this.lobbyInfo(client));
    });
  }

  getClients() {
    return this.clients;
  }

  _initInfo(socket) {
    const data = {
      id: socket.id,
      nickName: socket.nickName,
    }
    sendResponse(socket, commandList.initInfo, data);
  }
}

if (!lobbyInstance) {
  lobbyInstance = new Lobby();
}

module.exports = lobbyInstance;

