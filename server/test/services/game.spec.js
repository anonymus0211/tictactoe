'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const { createStubSocket } = require('../helper');
const gameCollection = require('../../services/gameCollection');
const lobby = require('../../services/lobby');
const Game = require('../../services/game');

describe ('Game', () => {
  it('should #sendInit works', done => {
    const msg = [];
    const msg2 = [];
    const player1 = createStubSocket(msg);
    const player2 = createStubSocket(msg2);
    const game = new Game(player1, player2);
    const spy = sinon.spy(game, '_spectatorInfo');

    game.sendInit();

    expect(spy.called);
    expect(msg.length).to.eq(3);
    expect(msg2.length).to.eq(3);
    game._spectatorInfo.restore();
    done();
  });

  it('should #addSpectator works', done => {
    const player1 = createStubSocket();
    const player2 = createStubSocket();
    const spectator = createStubSocket();
    const game = new Game(player1, player2);

    game.addSpectator(spectator);

    expect(game.spectators.length).to.eq(1);
    expect(game.spectators[0].id).to.eq(spectator.id);
    done();
  });

  it('should #addSpectator not add when already added', done => {
    const msg = [];
    const player1 = createStubSocket();
    const player2 = createStubSocket();
    const spectator = createStubSocket(msg);
    const game = new Game(player1, player2);
    game.spectators = [spectator];

    game.addSpectator(spectator);

    expect(msg.length).to.eq(1);
    expect(msg[0].error).to.eq('You are already a spectator on this game');
    done();
  });

  describe('#makeStep', () => {
    it('should step', done => {
      const player1 = createStubSocket();
      const player2 = createStubSocket();
      const game = new Game(player1, player2);
      
      game.makeStep(player1, 1, 1);

      expect(game.board[0][0]).to.eq('X');
      expect(game.nextPlayer.id).to.eq(player2.id);
      done();
    });

    it('should return invalid turn', done => {
      const msg = [];
      const player1 = createStubSocket();
      const player2 = createStubSocket(msg);
      const game = new Game(player1, player2);
      
      game.makeStep(player2, 1, 1);

      expect(msg.length).to.eq(1);
      expect(msg[0].error).to.eq('It is not your turn!');
      done();
    });

    it('should return invalid input', done => {
      const msg = [];
      const player1 = createStubSocket(msg);
      const player2 = createStubSocket();
      const game = new Game(player1, player2);
      
      game.makeStep(player1, 4, 1);

      expect(msg.length).to.eq(1);
      expect(msg[0].error).to.eq('Invalid input: coordinates are outside the playable area');
      done();
    });

    it('should return invalid space', done => {
      const msg = [];
      const player1 = createStubSocket(msg);
      const player2 = createStubSocket();
      const game = new Game(player1, player2);
      game.board[0][0] = 'X';

      game.makeStep(player1, 1, 1);

      expect(msg.length).to.eq(1);
      expect(msg[0].error).to.eq('Invalid input: that space already taken');
      done();
    });

    it('should return game is over', done => {
      const msg = [];
      const msg2 = [];
      const player1 = createStubSocket(msg);
      const player2 = createStubSocket(msg2);
      const game = new Game(player1, player2);
      game.board[0][0] = 'X';
      game.board[1][0] = 'X';

      game.makeStep(player1, 1, 3);

      expect(msg.length).to.eq(1);
      expect(msg2.length).to.eq(1);
      expect(msg[0].data).to.eq('You won');
      expect(msg2[0].data).to.eq('You Lose');
      done();
    });

    it('should return draw', done => {
      const msg = [];
      const msg2 = [];
      const player1 = createStubSocket(msg);
      const player2 = createStubSocket(msg2);
      const game = new Game(player1, player2);
      game.moveCounter = 8;
      game.nextPlayer = player2;
      game.board = [
        [ 'X', 'O', 'X' ],
        [ 'O', 'X', 'O' ],
        [ 'O', 'X', 0],
      ];

      game.makeStep(player2, 3, 3);

      expect(msg.length).to.eq(1);
      expect(msg2.length).to.eq(1);
      expect(msg[0].data).to.eq('It is a draw');
      expect(msg2[0].data).to.eq('It is a draw');
      done();
    });
  });
});