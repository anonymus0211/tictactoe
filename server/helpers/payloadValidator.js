'use strict';

const Joi = require('joi');

module.exports = {
  gameWith: Joi.object().keys({
    guestId: Joi.string().required(),
  }),
};