'use strict';

const hat = require('hat');
const commands = require('../helpers/commandList');
const { 
  sendResponse,
  sendError,
} = require('../helpers/response');

class Game {
  constructor(player1, player2) {
    // Create random four character ids
    this.id = hat(16,36);
    this.player1 = player1;
    this.player2 = player2;
    this.board = [[0,0,0,], [0,0,0], [0,0,0]];
    this.nextPlayer = player1;
    this.spectators = [];
    this.moveCounter = 0;
  }

  sendInit() {  
    sendResponse(this.player1, commands.sysMessage, `Game started with: ${this.player2.nickName}`);
    sendResponse(this.player1, commands.sysMessage, 'You are `X`')
    sendResponse(this.player1, commands.gameBoard, this.gameResponse());
    sendResponse(this.player2, commands.sysMessage, `Game started with ${this.player1.nickName}`);
    sendResponse(this.player2, commands.sysMessage, 'You are `O`')
    sendResponse(this.player2, commands.gameBoard, this.gameResponse());
    this._spectatorInfo();
  }

  addSpectator(spectator) {
    if(this.spectators.includes(spectator)) {
      return sendError(spectator, 'You are already a spectator on this game');
    }
    this.spectators.push(spectator);
  }

  removeSpectator(spectator) {
    this.spectators.splice(this.spectators.indexOf(spectator), 1);
  }

  _spectatorInfo() {
    this.spectators.forEach(spectator => {
      sendResponse(spectator, commands.gameSpec, this.gameResponse(true));
    });
  }

  /**
   * 
   * @param {*} player 
   * @param {*} x 
   * @param {*} y 
   * @returns {Boolean} Did the game ended?
   */
  makeStep(player, x, y) {
    // Correct player send coordinates?
    if (this.nextPlayer.id !== player.id) {
      return sendError(player, 'It is not your turn!');
    }
    // Check that move is valid or not
    if ( ((x < 1) || (x > 3)) || ((y < 1) || (y > 3)) ) {
      return sendError(player, 'Invalid input: coordinates are outside the playable area');
    }

    if( this.board[y-1][x-1] === 'X' || this.board[y-1][x-1] === 'O') {
      return sendError(player, 'Invalid input: that space already taken');
    }

    const symbol = player.id === this.player1.id ? 'X' : 'O';
    const nextPlayer = player.id === this.player1.id ? this.player2 : this.player1;
    this.board[y-1][x-1] = symbol;
    this.moveCounter++;

    const [ winner, draw ] = this._checkWinner();
    // const gameCollection = require('./gameCollection');
    if (winner) {
      // if someone win, send messages tehn move back to lobby
      if (this.player1.id === player.id) {
        sendResponse(this.player1, commands.sysMessage, 'You won');
        sendResponse(this.player2, commands.sysMessage, 'You Lose');
      } else {
        sendResponse(this.player2, commands.sysMessage, 'You won');
        sendResponse(this.player1, commands.sysMessage, 'You Lose');
      }
      // Game ended higher level make cleanup
      return true;
    } else if( draw ) {
      // if draw, sends messages and move back to lobby
      sendResponse(this.player1, commands.sysMessage, 'It is a draw');
      sendResponse(this.player2, commands.sysMessage, 'It is a draw');
      // Game ended higher level make cleanup
      return true
    } else {
      // next move
      this.nextPlayer = nextPlayer;
      this._updateParticipants();
    }

    return false
  }

  _updateParticipants() {
    sendResponse(this.player1, commands.gameBoard, this.gameResponse());
    sendResponse(this.player2, commands.gameBoard, this.gameResponse());
    this._spectatorInfo();
  }

  _checkWinner() {
    if ((this.board[0][0] + this.board[1][1] + this.board[2][2] === "XXX") ||
        (this.board[0][0] + this.board[1][1] + this.board[2][2] === "OOO") ||
        ((this.board[0][2] + this.board[1][1] + this.board[2][0] === "XXX") ||
        (this.board[0][2] + this.board[1][1] + this.board[2][0] === "OOO"))) {
      return [true, null];
    }
    else if ((this.board[0][0] + this.board[0][1] + this.board[0][2] === "XXX") ||
      (this.board[0][0] + this.board[0][1] + this.board[0][2] === "OOO") ||
      (this.board[1][0] + this.board[1][1] + this.board[1][2] === "XXX") ||
      (this.board[1][0] + this.board[1][1] + this.board[1][2] === "OOO") ||
      (this.board[2][0] + this.board[2][1] + this.board[2][2] === "XXX") ||
      (this.board[2][0] + this.board[2][1] + this.board[2][2] === "OOO")) {
      return [true, null];
    }
    else if ((this.board[0][0] + this.board[1][0] + this.board[2][0] === "XXX") ||
      (this.board[0][0] + this.board[1][0] + this.board[2][0] === "OOO") ||
      (this.board[0][1] + this.board[1][1] + this.board[2][1] === "XXX") ||
      (this.board[0][1] + this.board[1][1] + this.board[2][1] === "OOO") ||
      (this.board[0][2] + this.board[1][2] + this.board[2][2] === "XXX") ||
      (this.board[0][2] + this.board[1][2] + this.board[2][2] === "OOO")) {
      return [true, null];
    } else if (this.moveCounter >= 9) {
      return [false, true];
    }

    return [ false, false];
  }

  gameResponse(isSpectator = false) {
    return {
      id: this.id,
      board: this.board,
      nextPlayer: this.nextPlayer.id,
      isSpectator,
    };
  }

  gameListResponse() {
    return {
      id: this.id,
      players: [
        this.player1.nickName,
        this.player2.nickName
      ],
    }
  }


}

module.exports = Game;