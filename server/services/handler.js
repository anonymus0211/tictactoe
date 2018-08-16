'use strict';

const Joi = require('joi');

const { commandList, response, payloadValidator } = require('../helpers');
const {
  parseInputData, 
  sendError,
  sendResponse,
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

  console.log(`New input from ${this.nickName}`);
  console.log(JSON.stringify(data, null, 2));

  try {
    switch (data.command) {
      case commandList.initInfo:
        sendResponse(this, commandList.initInfo, { id: this.id, nickName: this.nickName });
        break;
      case commandList.getLobby:
        return lobby.sendLobbyInfo(this);
        break;
      
      case commandList.gameWith:
        const payload = validatePayload(payloadValidator.gameWith, data.payload);
        gameCollection.add(this, payload.guestId);
        break;

      case commandList.draw: {
          const { gameId, x, y } = validatePayload(payloadValidator.draw, data.payload);
          const game = gameCollection.getGame(gameId);
          if (!game) {
            sendError(this, 'Game not found');
          }
          if(game.makeStep(this, x, y)) {
            // if return true, match is over
            // remove game and move back users to lobby
            gameCollection.remove(game);
          }
        }
        break;
      case commandList.gameList:
        gameCollection.sendGameList(this);
        break;
      case commandList.spec: {
          const { gameId } = validatePayload(payloadValidator.spec, data.payload);
          gameCollection.addSpectatorToGame(gameId, this);
        }
        break;
      case commandList.leaveSpec: {
          const { gameId } = validatePayload(payloadValidator.leaveSpec, data.payload);
          gameCollection.removeSpectatorFromGame(gameId, this);
        }
        break;
      case commandList.giveUp: {
          const { gameId } = validatePayload(payloadValidator.giveUp, data.payload);
          gameCollection.giveUp(gameId, this);
        }
        break;
      default:
        sendError(this, 'Command is not supported');
        break;
    }
  } catch (error) {
    console.error(error);
    sendError(this, error);
  }
  
};
