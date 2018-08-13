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
  }

  _initClient() {
    this.client.connect(this.port, this.host, this._clientReady.bind(this));

    this.client.on('data', this._onData.bind(this));

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

  _onData(data) {
    try {
      // ui.showMessage(data.toString());
      const parsed = JSON.parse(data.toString())
    
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