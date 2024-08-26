const express = require('express');
const passport = require('passport');

const RoomsService = require('../services/room.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createRoomSchema, updateRoomSchema, getRoomSchema } = require('../schemas/room.schema');
const formatResponse = require('../utils/response/response-formatter');

const router = express.Router();
const service = new RoomsService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  async (req, res, next) => {
    try {
      const rooms = await service.findAll();
      res.json(formatResponse(true, rooms, "Rooms obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(getRoomSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const room = await service.findOne(parseInt(id, 10));
      res.json(formatResponse(true, room, "Room obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createRoomSchema, 'body'), async (req, res, next) => {
    try {
      const body = req.body;
      const newRoom = await service.create(body);
      res.status(201).json(formatResponse(true, newRoom, "Room created successfully"));
    } catch (error) {
      next(error);
    }

  });

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getRoomSchema, 'params'),
  validatorHandler(updateRoomSchema, 'body'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedRoom = await service.update(parseInt(id, 10), body);
      res.status(200).json(formatResponse(true, updatedRoom, "Room updated successfully"));
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
      const updatedRoom = await service.delete(parseInt(id, 10));
      res.status(200).json(formatResponse(true, updatedRoom, "Room deleted successfully"));
    } catch (error) {
      next(error);
    }

  });

module.exports = router;
