'use strict';

const commands = require('./commands');
const tcpCommands = require('./tcpCommands');
const ui = require('./ui');

// List of commands which are use everywhere
const defaultCommands = [
  commands.exit,
  commands.help,
  commands.sysMessage,
];

// Authorized commands while in a spectator mode
const spectatorCommands = [
  ...defaultCommands,
  commands.leaveSpec,
];

// Authorized commands while in a game mode
const inGameCommands = [
  ...defaultCommands,
  commands.draw,
  commands.giveUp,
];

// Authorized commands while in a lobby
const lobbyCommands = [
  ...defaultCommands,
  commands.getLobby,
  commands.gameList,
  commands.gameWith,
  commands.spec,
];

class InputHandler {
  constructor(client, sharedState) {
    this.client = client;
    this.sharedState = sharedState;
  }

  handler(input) {
    console.log("you entered: [" + input + "]");
    const [command, ...args] = input.split(' ');

    const { inGame, isSpectator } = this.sharedState;

    if (inGame && !isSpectator && !inGameCommands.includes(command)) {
      return ui.showError('Cannot use this command while in a Game');
    } else if (inGame && isSpectator && !spectatorCommands.includes(command)) {
      return ui.showError('Cannot use this command while spectating a game');
    } else if(!inGame && !lobbyCommands.includes(command)) {
      return ui.showError('Cannot use this command while in a lobby');
    }
    
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
      case commands.leaveSpec:
        this._leaveSpec();
        break;
      case commands.giveUp:
        this._giveUp();
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

  _leaveSpec() {
    this.client.sendData(tcpCommands.leaveSpec(this.sharedState.gameId));
  }

  _giveUp() {
    this.client.sendData(tcpCommands.giveUp(this.sharedState.gameId));
  }
}

module.exports = InputHandler;