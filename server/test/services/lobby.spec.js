'use strict';

const expect = require('chai').expect;

const { createStubSocket } = require('../helper');

const lobby = require('../../services/lobby');

// re-init lobby
afterEach(function () {
  lobby.clients = [];
  lobby.guestId = 0;
});

describe ('Lobby', () => {
  it('After create it should be empty', (done) => {
    expect(lobby.clients.length).to.eq(0);
    done();
  });

  it('should #addNew works', (done) => {
    const messages = [];
    const socket = createStubSocket(messages, false);

    lobby.addNew(socket);

    expect(lobby.clients.length).to.eq(1);
    expect(messages.length).to.eq(2);
    expect(!!socket.id).to.eq(true);
    const commands = messages.map(m => m.command );
    expect(commands.includes('initInfo')).to.eq(true);
    expect(commands.includes('backToLobby')).to.eq(true);
    done();
  });

  it('should #add socket', (done) => {
    const messages = [];
    const socket = createStubSocket(messages);

    lobby.add(socket);

    expect(lobby.clients.length).to.eq(1);
    expect(messages.length).to.eq(1);
    const commands = messages.map(m => m.command );
    expect(commands.includes('backToLobby')).to.eq(true);
    done();
  });

  it('should #add socket and broadcast', (done) => {
    const messages = [];
    const broadcastMsg = [];

    const otherSoc = createStubSocket(broadcastMsg);
    const socket = createStubSocket(messages);

    lobby.clients = [ otherSoc ];

    lobby.add(socket);

    expect(lobby.clients.length).to.eq(2);
    expect(messages.length).to.eq(1);
    let commands = messages.map(m => m.command );
    expect(commands.includes('backToLobby')).to.eq(true);
    
    expect(broadcastMsg.length).to.eq(2);
    commands = broadcastMsg.map(m => m.command );
    expect(commands.includes('sysMessage')).to.eq(true);
    expect(commands.includes('getLobby')).to.eq(true);
    
    done();
  });

  it('should #remove a socket', done => {
    const messages = [];
    const socket = createStubSocket(messages);
    lobby.clients = [socket];

    lobby.remove(socket);

    expect(lobby.clients.length).to.eq(0);
    done();
  });

  it('should #leftSystem works', done => {
    const messages = [];
    const otherSocMsg = [];
    const otherSoc = createStubSocket(otherSocMsg);
    const socket = createStubSocket(messages);
    lobby.clients = [otherSoc, socket];

    lobby.leftSystem(socket);

    expect(lobby.clients.length).to.eq(1);
    expect(otherSocMsg.length).to.eq(2);
    const commands = otherSocMsg.map(m => m.command );
    expect(commands.includes('sysMessage')).to.eq(true);
    expect(commands.includes('getLobby')).to.eq(true);
    done();
  });
});