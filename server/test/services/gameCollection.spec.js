'use strict';

const { expect } = require('chai');
const sinon = require('sinon');

const { createStubSocket } = require('../helper');
const gameCollection = require('../../services/gameCollection');
const lobby = require('../../services/lobby');
const Game = require('../../services/game');

beforeEach(() => {
  gameCollection.games = [];
  lobby.clients = [];
});

describe ('GameCollection', () => {
  it('should #add a game', done => {
    const player1 = createStubSocket();
    const player2 = createStubSocket();

    lobby.clients = [player1, player2];

    gameCollection.add(player1, player2.id);

    expect(lobby.clients.length).to.eq(0);
    expect(gameCollection.games.length).to.eq(1);

    expect(gameCollection.games[0].player1.id).to.eq(player1.id);
    expect(gameCollection.games[0].player2.id).to.eq(player2.id);
    done();
  });

  it('should not #add when in game', done => {
    const msg = [];
    const player1 = createStubSocket(msg);
    const player2 = createStubSocket();

    const game = new Game(player1, player2);
    gameCollection.games.push(game);

    gameCollection.add(player1, player2.id);

    expect(gameCollection.games.length).to.eq(1);

    const errors = msg.map(m => m.error);
    expect(errors.length).to.eq(1);
    expect(errors[0]).to.eq('Already in a game');

    done();
  });


  it('should not #add when not in lobby', done => {
    const msg = [];
    const player1 = createStubSocket(msg);
    const player2 = createStubSocket();

    lobby.clients = [player1];

    gameCollection.add(player1, player2.id);

    expect(lobby.clients.length).to.eq(1);
    expect(gameCollection.games.length).to.eq(0);

    const errors = msg.map(m => m.error);
    expect(errors.length).to.eq(1);
    expect(errors[0]).to.eq('Other user is not online');
    done();
  });

  it('should #remove game and add users back to lobby', done => {
    const player1 = createStubSocket();
    const player2 = createStubSocket();

    const game = new Game(player1, player2);
    gameCollection.games.push(game);

    gameCollection.remove(game);

    expect(gameCollection.games.length).to.eq(0);
    expect(lobby.clients.length).to.eq(2);
    done();
  });

  it('should #removeByPlayer call remove', done => {
    const spy = sinon.spy(gameCollection, 'remove');
    const player1 = createStubSocket();
    const player2 = createStubSocket();

    const game = new Game(player1, player2);
    gameCollection.games.push(game);

    gameCollection.removeByPlayer(player1);

    expect(spy.called);
    gameCollection.remove.restore();
    done();
  });

  it('should not #removeByPlayer call remove', done => {
    const spy = sinon.spy(gameCollection, 'remove');
    const player1 = createStubSocket();
    const player2 = createStubSocket();
    const player3 = createStubSocket();

    const game = new Game(player1, player2);
    gameCollection.games.push(game);

    gameCollection.removeByPlayer(player3);

    expect(spy.notCalled);
    gameCollection.remove.restore();
    
    done();
  });

  it('should #getGame return game by Id', done => {
    const player1 = createStubSocket();
    const player2 = createStubSocket();

    let game = new Game(player1, player2);
    gameCollection.games.push(game);

    game = gameCollection.getGame(game.id);
    
    expect(game);
    done();
  });

  it('should #addSpectatorToGame works', done => {
    const msg = [];
    const player1 = createStubSocket();
    const player2 = createStubSocket();
    const spectator = createStubSocket(msg);

    const game = new Game(player1, player2);
    gameCollection.games.push(game);

    const specSpy = sinon.spy(game, 'addSpectator');
    const lobbySpy = sinon.spy(lobby, 'remove');

    gameCollection.addSpectatorToGame(game.id, spectator);

    expect(specSpy.called);
    expect(lobbySpy.called);

    const commands = msg.map(m => m.command);

    expect(commands.length).to.eq(2);
    expect(commands.includes('sysMessage'));
    expect(commands.includes('gameSpec'));

    game.addSpectator.restore();
    lobby.remove.restore();
    done();
  });

  it('should #removeSpectatorFromGame works', done => {
    const msg = [];
    const player1 = createStubSocket();
    const player2 = createStubSocket();
    const spectator = createStubSocket(msg);

    const game = new Game(player1, player2);
    game.spectators = [spectator];

    gameCollection.games.push(game);

    const specSpy = sinon.spy(game, 'removeSpectator');
    const lobbySpy = sinon.spy(lobby, 'add');

    gameCollection.removeSpectatorFromGame(game.id, spectator);

    expect(specSpy.called);
    expect(lobbySpy.called);

    const commands = msg.map(m => m.command);
    expect(commands.length).to.eq(2);
    expect(commands.includes('sysMessage'));
    expect(commands.includes('backToLobby'));
    
    game.removeSpectator.restore();
    lobby.add.restore();
    done();
  });

  it('shold #giveUp works', done => {
    const player1 = createStubSocket();
    const player2 = createStubSocket();

    const game = new Game(player1, player2);
    gameCollection.games.push(game);

    const gameSpy = sinon.spy(game, 'giveUpBy');
    const collectionSpy = sinon.spy(gameCollection, 'removeByPlayer');

    gameCollection.giveUp(game.id, player1);

    expect(gameSpy.called);
    expect(collectionSpy.called);

    expect(gameCollection.games.length).to.eq(0);
    expect(lobby.clients.length).to.eq(2);
    
    game.giveUpBy.restore();
    gameCollection.removeByPlayer.restore();
    done();
  });
});