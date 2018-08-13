'use strict';

const Joi = require('joi');

module.exports = {
  gameWith: Joi.object().keys({
    guestId: Joi.string().required(),
  }),
  draw: Joi.object().keys({
    gameId: Joi.string().required(),
    x: Joi.number().integer().min(1).max(3).required(),
    y: Joi.number().integer().min(1).max(3).required(),
  }),
  spec: Joi.object().keys({
    gameId: Joi.string().required(),
  }),
};