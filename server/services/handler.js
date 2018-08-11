'use strict';

const Joi = require('joi');

const { commandList, response } = require('../helpers');
const {
  parseInputData, 
  sendError, 
  sendResponse
} = response;
const lobby = require('./lobby');

const baseSchema = Joi.object().keys({
  command: Joi.string().required(),
  payload: Joi.object(),
});


module.exports = function handler(socketData) {
  const input = parseInputData(socketData);
  const { error, value: data } = Joi.validate(input, baseSchema);

  if (error) {
    console.error(error);
    sendError(this, error.message);
  }
  console.log(data);

  switch (data.command) {
    case commandList.getLobby:
      return lobby.sendLobbyInfo(this);
      break;
    
    case commandList.gameWith:
      makePrivateGame(socket, data);
      break;
  
    default:
      break;
  }
}