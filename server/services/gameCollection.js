'use strict';

const lobby = require('./lobby');
const Game = require('./game');
const commands = require('../helpers/commandList');
const { 
  sendResponse,
  sendError,
} = require('../helpers/response');

class GameCollection {
  constructor() {
    // Holds Game objects;
    this.games = [];
  }

  add(currentSocket, otherId) {
    const inGame = this.games.some((game) => {
      game.player1.id === currentSocket.id ||
      game.player2.id === otherId
    });

    if (inGame) {
      return sendError(currentSocket, 'Already in a game');
    }

    // Check lobby for that other user is still available
    const otherSocket = lobby.getClients()
      .find((client) => client.id === otherId || client.nickName === otherId);

    if (!otherSocket) {
      return sendError(currentSocket, 'Other user is not online');
    }

    const game = new Game(currentSocket, otherSocket);
    this.games.push(game);

    // Remove user from lobby while in game
    lobby.remove(currentSocket);
    lobby.remove(otherSocket);

    game.sendInit();
  }

  remove(game){
    if (!game.player1.destroyed) {
      lobby.add(game.player1);
    }

    if (!game.player2.destroyed) {
      lobby.add(game.player2);
    }

    // move back spectators also
    if(game.spectators.length > 0 ) {
      game.spectators.forEach(spec => {
        if(!spec.destroyed) {
          lobby.add(spec);
        }
      })
    }

    const gameIndex = this.games.indexOf(game);
    if (gameIndex >= 0) {
      this.games.splice(gameIndex, 1);
    }
  }

  removeByPlayer(socket) {
    const game = this.games.find(game => {
      return game.player1.id === socket.id ||
             game.player2.id === socket.id
    });

    if (game) {
      this.remove(game);
    }
  }

  getGame(gameId) {
    return this.games.find((game) => gameId === game.id);
  }

  sendGameList(socket) {
    const data = this.games.map(game => game.gameListResponse());
    sendResponse(socket, commands.gameList, data);
  }

  addSpectatorToGame(game, specator) {

  }

  removeSpectatorFromGame(game, spectator) {
    
  }

}

module.exports = new GameCollection();