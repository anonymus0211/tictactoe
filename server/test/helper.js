'use strict';

const net = require('net');
const sinon = require('sinon');
const hat = require('hat');

module.exports = {
  createStubSocket(messages = null, withId = true) {
    const socket = new net.Socket();
    sinon.stub(socket, 'write').callsFake(function (data) {
      if (messages) {
        messages.push(JSON.parse(data));
      }
      return null;
    });
    if (withId) {
      socket.id = hat();
      socket.nickName = hat(16,32);
    }
    return socket;
  }
};
