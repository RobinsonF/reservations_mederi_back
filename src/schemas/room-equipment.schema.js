const Joi = require('joi');

const id = Joi.number();
const roomId = Joi.number();
const equipmentId = Joi.number();
const quantity = Joi.number();
const active = Joi.boolean();

const createRoomEquipmentSchema = Joi.object({
  roomId: roomId.required(),
  equipmentId: equipmentId.required(),
  quantity: quantity.required(),
  active: active.required()
});

const updateRoomEquipmentSchema = Joi.object({
  roomId: roomId,
  equipmentId: equipmentId,
  quantity: quantity,
  active: active,
});

const getRoomEquipmentSchema = Joi.object({
  id: id.required()
});

module.exports = { createRoomEquipmentSchema, updateRoomEquipmentSchema, getRoomEquipmentSchema }
