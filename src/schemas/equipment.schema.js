const Joi = require('joi');

const id = Joi.number();
const name = Joi.string();
const description = Joi.string();
const quantity = Joi.number();
const active = Joi.boolean();

const createEquipmentSchema = Joi.object({
  name: name.required(),
  description: description.required(),
  quantity: quantity.required(),
  active: active.required()
});

const updateEquipmentSchema = Joi.object({
  name: name,
  description: description,
  quantity: quantity,
  active: active,
});

const getEquipmentSchema = Joi.object({
  id: id.required()
});

module.exports = { createEquipmentSchema, updateEquipmentSchema, getEquipmentSchema }
