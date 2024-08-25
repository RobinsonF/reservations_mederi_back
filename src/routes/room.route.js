const express = require('express');

const RoomsService = require('../services/room.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createRoomSchema, updateRoomSchema, getRoomSchema } = require('../schemas/room.schema');

const router = express.Router();
const service = new RoomsService();

router.get('/', async (req, res, next) => {
  try {
    const rooms = await service.findAll();
    res.json(rooms);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getRoomSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const room = await service.findOne(parseInt(id, 10));
    res.json(room);
  } catch (error) {
    next(error);
  }
});

router.post('/', validatorHandler(createRoomSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body;
    const newRoom = await service.create(body);
    res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }

});

router.put('/:id',
  validatorHandler(getRoomSchema, 'params'),
  validatorHandler(updateRoomSchema, 'body'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedRoom = await service.update(parseInt(id, 10), body);
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }

});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRoom = await service.delete(parseInt(id, 10));
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }

});

module.exports = router;
