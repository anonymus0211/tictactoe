'use strict';

let gameCollection = null;

class GameCollection {
  constructor() {
    this.games = [];
  }

  add() {
  }

  remove(){}

  gameList(){}

  sendGameList() {
  }

}

if (!gameCollection) {
  gameCollection = new GameCollection();
}

module.exports = gameCollection;