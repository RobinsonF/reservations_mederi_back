const Joi = require('joi');

const id = Joi.number();
const name = Joi.string();
const email = Joi.string();
const password = Joi.string();
const role = Joi.string();
const active = Joi.boolean();

const createUserSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
  role: role.required(),
  active: active.required(),
});

const updateUserSchema = Joi.object({
  name: name,
  email: email,
  password: password,
  role: role,
  active: active
});

const getUserSchema = Joi.object({
  id: id.required()
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema }
