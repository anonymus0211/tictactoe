'use strict';
const net = require('net');
const readline = require('readline');


const TcpClient = require('./helpers/tcpClient');
const InputHandler = require('./helpers/inputHandler');
const ui = require('./helpers/ui');
const commands = require('./helpers/commands');

const prompt = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const HOST_PORT = 1337;
const HOST_IP = '127.0.0.1';

let client = null;

/**
 * 'global' variables for tcpClient and InputHandler
 * inGame: when user in game then cannot list lobby etc
 */
const sharedState = {
  inGame: false,
  id: null,
  gameId: null,
  nickName: '',
};

ui.openingText();

client = new TcpClient(HOST_IP, HOST_PORT, sharedState);

const inputHandler = new InputHandler(client, sharedState);

prompt.on('line', inputHandler.handler.bind(inputHandler));
