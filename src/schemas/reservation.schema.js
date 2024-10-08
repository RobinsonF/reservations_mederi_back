const Joi = require('joi');

const id = Joi.number();
const roomId = Joi.number();
const userId = Joi.number();
const startTime = Joi.date();
const endTime = Joi.date();
const purpose = Joi.string();
const status = Joi.string();
const active = Joi.boolean();

const limit = Joi.number().integer();
const offset = Joi.number().integer();

const createReservationSchema = Joi.object({
  roomId: roomId.required(),
  userId: userId.required(),
  startTime: startTime.required(),
  endTime: endTime.required(),
  purpose: purpose.required(),
  status: status.required(),
  active: active.required()
});

const updateReservationSchema = Joi.object({
  roomId: roomId,
  userId: userId,
  startTime: startTime,
  endTime: endTime,
  purpose: purpose,
  status: status,
  active: active
});

const getReservationSchema = Joi.object({
  id: id.required()
});

const queryReservationSchema = Joi.object({
  limit: limit,
  offset: offset
});

module.exports = { createReservationSchema, updateReservationSchema, getReservationSchema, queryReservationSchema }
