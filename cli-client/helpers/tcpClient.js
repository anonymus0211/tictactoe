'use strict';

const net = require('net');
const ui = require('./ui');
const commands = require('./commands');

class TcpClient {
  constructor(host = '127.0.0.1', port = 1337, sharedState) {
    this.host = host;
    this.port = port;
    this.client = new net.Socket();
    this._initClient();
    this.inGame = false;
    this.sharedState = sharedState;
    this.buff = '';
  }

  _initClient() {
    this.client.connect(this.port, this.host, this._clientReady.bind(this));

    this.client.on('data', (data) => {
      const responses = this._deserialize(data);
      for( let res of responses) {
        this._onData(res);
      }
    });

    this.client.on('close', function() {
      console.log('Connection closed');
      this.client.setTimeout(2000, function() {
        this.client.connect(this.port, this.host);
      })
    });

    this.client.on('error', function(e) {
      console.log(e);
      this.client.setTimeout(2000, function() {
        this.client.connect(this.port, this.host);
      })
    })
  }

  _clientReady() {
    ui.clientConnected();
  }

  _deserialize(string) {
    const objects = [];
    let i;
    let l = 0;
    this.buff += Buffer.from(string).toString();
    while ((i = this.buff.indexOf('\n', l)) !== -1) {
      objects.push(JSON.parse(this.buff.slice(l, i)));
      l = i + 1;
    }
    if (l) this.buff = this.buff.slice(l);
    return objects;
  }

  _onData(parsed) {
    try {
      // ui.showMessage(data.toString());
      //const parsed = JSON.parse(data.toString())
    
      if (parsed.error) {
        return ui.showError(parsed.error);
      }

      switch (parsed.command) {
        case commands.getLobby:
          if (this.sharedState.inGame) {
            break;
          } 
          ui.printLobby(parsed.data);
          break;
        case commands.sysMessage:
          ui.showMessage(parsed.data);
          break;
        case commands.initInfo:
          this.sharedState.id = parsed.data.id;
          this.sharedState.nickName = parsed.data.nickName;
          ui.showMessage(`Your id: ${this.sharedState.id}, nickName: ${this.sharedState.nickName}`);
          break;
        case commands.gameBoard:
          this.sharedState.inGame = true;
          this.sharedState.gameId = parsed.data.id;
          ui.initBoard(parsed.data.board);
          ui.nextMove(this.sharedState.id, parsed.data.nextPlayer);
          break;
        case commands.backToLobby:
          if (this.sharedState.inGame) {
            ui.showMessage('You are moved back to lobby');
          }
          this.sharedState.inGame = false;
          this.sharedState.gameId = null;
          break;
        case commands.gameList:
          ui.printGameList(parsed.data);
          break;
        default:
          ui.showError('Invalid TCP command received');
          ui.showError(JSON.stringify(parsed, null, 2));
          break;
      }

    } catch( error ) {
      console.log(JSON.stringify(error, null, 2));
      return ui.showError(error.message);
    }
  }

  sendData(data) {
    this.client.write(JSON.stringify(data));
  }
}

module.exports = TcpClient;