const express = require('express');

const RoomEquipmentService = require('../services/room-equipment.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createRoomEquipmentSchema, updateRoomEquipmentSchema, getRoomEquipmentSchema } = require('../schemas/room-equipment.schema');

const router = express.Router();
const service = new RoomEquipmentService();

router.get('/', async (req, res, next) => {
  try {
    const roomEquipment = await service.findAll();
    res.json(roomEquipment);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getRoomEquipmentSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const roomEquipment = await service.findOne(parseInt(id, 10));
    res.json(roomEquipment);
  } catch (error) {
    next(error);
  }
});

router.post('/', validatorHandler(createRoomEquipmentSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body;
    const newRoomEquipment = await service.create(body);
    res.status(201).json(newRoomEquipment);
  } catch (error) {
    next(error);
  }

});

router.put('/:id',
  validatorHandler(getRoomEquipmentSchema, 'params'),
  validatorHandler(updateRoomEquipmentSchema, 'body'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedRoomEquipment = await service.update(parseInt(id, 10), body);
    res.status(200).json(updatedRoomEquipment);
  } catch (error) {
    next(error);
  }

});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedRoomEquipment = await service.delete(parseInt(id, 10));
    res.status(200).json(updatedRoomEquipment);
  } catch (error) {
    next(error);
  }

});

module.exports = router;
