const express = require('express');

const UsersService = require('../services/user.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createUserSchema, updateUserSchema, getUserSchema } = require('../schemas/user.schema');

const router = express.Router();
const service = new UsersService();

router.get('/', async (req, res, next) => {
  try {
    const users = await service.findAll();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getUserSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await service.findOne(parseInt(id, 10));
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/', validatorHandler(createUserSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body;
    const newUser = await service.create(body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }

});

router.put('/:id',
  validatorHandler(getUserSchema, 'paramas'),
  validatorHandler(updateUserSchema, 'body') ,async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedUser = await service.update(parseInt(id, 10), body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }

});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedUser = await service.delete(parseInt(id, 10));
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
