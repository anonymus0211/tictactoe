'use strict';

const commands = require('./commands');
const tcpCommands = require('./tcpCommands');
const ui = require('./ui');

class InputHandler {
  constructor(client, sharedState) {
    this.client = client;
    this.sharedState = sharedState;
  }

  handler(input) {
    console.log("you entered: [" + input + "]");
    const [command, ...args] = input.split(' ');

    switch (command) {
      case commands.help:
        ui.help();
        break;
      case commands.exit:
        ui.exitText();
        process.exit(0);
        break;
      case commands.getLobby:
        this._getLobby();
        break;
      case commands.gameWith:
        this._gameWith(...args);
        break;
      default:
        ui.badCommand();
        break;
    }
  }

  _getLobby() {
    this.client.sendData({ command: 'getLobby' });
  }

  _gameWith(player) {
    this.client.sendData(tcpCommands.gameWith(player));
  }
}

module.exports = InputHandler;