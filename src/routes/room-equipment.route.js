const express = require('express');
const passport = require('passport');

const RoomEquipmentService = require('../services/room-equipment.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createRoomEquipmentSchema, updateRoomEquipmentSchema, getRoomEquipmentSchema } = require('../schemas/room-equipment.schema');
const formatResponse = require('../utils/response/response-formatter');

const router = express.Router();
const service = new RoomEquipmentService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const roomEquipment = await service.findAll();
      res.json(formatResponse(true, roomEquipment, 'Room equipment obtained successfully'));
    } catch (error) {
      next(error);
    }
  });

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getRoomEquipmentSchema, 'params'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const roomEquipment = await service.findOne(parseInt(id, 10));
      res.json(formatResponse(true, roomEquipment, 'Room equipment obtained successfully'));
    } catch (error) {
      next(error);
    }
  });

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createRoomEquipmentSchema, 'body'), async (req, res, next) => {
    try {
      const body = req.body;
      const newRoomEquipment = await service.create(body);
      res.status(201).json(formatResponse(true, newRoomEquipment, 'Room equipment created successfully'));
    } catch (error) {
      next(error);
    }

  });

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getRoomEquipmentSchema, 'params'),
  validatorHandler(updateRoomEquipmentSchema, 'body'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedRoomEquipment = await service.update(parseInt(id, 10), body);
      res.status(200).json(formatResponse(true, updatedRoomEquipment, 'Room equipment updated successfully'));
    } catch (error) {
      next(error);
    }

  });

router.delete('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedRoomEquipment = await service.delete(parseInt(id, 10));
      res.status(200).json(formatResponse(true, updatedRoomEquipment, 'Room equipment deleted successfully'));
    } catch (error) {
      next(error);
    }

  });

module.exports = router;
