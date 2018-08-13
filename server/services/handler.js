'use strict';

const Joi = require('joi');

const { commandList, response, payloadValidator } = require('../helpers');
const {
  parseInputData, 
  sendError, 
  sendResponse
} = response;
const lobby = require('./lobby');
const gameCollection = require('./gameCollection');

const baseSchema = Joi.object().keys({
  command: Joi.string().required(),
  payload: Joi.object(),
});

function validatePayload(validator, payload) {
  if (!payload) {
    throw 'No payload Command';
  }
  const { error, value } = Joi.validate(payload, validator);

  if (error) {
    throw error.message;
  }

  return value;
}


module.exports = function handler(socketData) {
  const input = parseInputData(socketData);
  const { error, value: data } = Joi.validate(input, baseSchema);

  if (error) {
    console.error(error);
    sendError(this, error.message);
  }
  console.log(data);

  try {
    switch (data.command) {
      case commandList.getLobby:
        return lobby.sendLobbyInfo(this);
        break;
      
      case commandList.gameWith:
        const payload = validatePayload(payloadValidator.gameWith, data.payload)
        makePrivateGame(socket, payload);
        break;
    
      default:
        break;
    }
  } catch (error) {
    console.error(error);
    sendError(this, error);
  }
  
}