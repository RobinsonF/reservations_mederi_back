const Joi = require('joi');

const id = Joi.number();
const name = Joi.string();
const location = Joi.string();
const capacity = Joi.number();
const active = Joi.boolean();

const createRoomSchema = Joi.object({
  name: name.required(),
  location: location.required(),
  capacity: capacity.required(),
  active: active.required()
});

const updateRoomSchema = Joi.object({
  name: name,
  location: location,
  capacity: capacity,
  active: active
});

const getRoomSchema = Joi.object({
  id: id.required()
});

module.exports = { createRoomSchema, updateRoomSchema, getRoomSchema }
