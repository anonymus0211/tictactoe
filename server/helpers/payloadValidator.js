'use strict';

const Joi = require('joi');

module.exports = {
  gameWith: Joi.object().keys({
    id: Joi.string().required(),
  }),
};