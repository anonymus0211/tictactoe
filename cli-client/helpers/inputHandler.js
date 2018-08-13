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
        this.client.client.end();
        process.exit(0);
        break;
      case commands.getLobby:
        this._getLobby();
        break;
      case commands.gameWith:
        this._gameWith(...args);
        break;
      case commands.draw:
        this._draw(...args);
        break;
      case commands.gameList:
        this._getGameList();
        break;
      case commands.spec:
        this._specGame(...args);
        break;
      default:
        ui.badCommand();
        break;
    }
  }

  _getLobby() {
    this.client.sendData(tcpCommands.getLobby());
  }

  _gameWith(player) {
    this.client.sendData(tcpCommands.gameWith(player));
  }

  _draw(x, y) {
    if ( ((x < 1) || (x > 3)) || ((y < 1) || (y > 3)) ) {
      return ui.showError('Wrong coordinates. Try again!');
    }
    this.client.sendData(tcpCommands.draw(this.sharedState.gameId, x, y));
  }

  _getGameList() {
    this.client.sendData(tcpCommands.gameList());
  }

  _specGame(gameId) {
    this.client.sendData(tcpCommands.spec(gameId));
  }
}

module.exports = InputHandler;