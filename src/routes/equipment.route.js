const express = require('express');
const passport = require('passport');

const EquipmentService = require('../services/equipment.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createEquipmentSchema, updateEquipmentSchema, getEquipmentSchema } = require('../schemas/equipment.schema');
const formatResponse = require('../utils/response/response-formatter');

const router = express.Router();
const service = new EquipmentService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const equipment = await service.findAll();
      res.json(formatResponse(true, equipment, "Equipment obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getEquipmentSchema, 'params'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const equipment = await service.findOne(parseInt(id, 10));
      res.json(formatResponse(true, equipment, "Equipment obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createEquipmentSchema, 'body'), async (req, res, next) => {
    try {
      const body = req.body;
      const newEquipment = await service.create(body);
      res.status(201).json(formatResponse(true, newEquipment, "Equipment created successfully"));
    } catch (error) {
      next(error);
    }

  });

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getEquipmentSchema, 'params'),
  validatorHandler(updateEquipmentSchema, 'body'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedEquipment = await service.update(parseInt(id, 10), body);
      res.status(200).json(formatResponse(true, updatedEquipment, "Equipment updated successfully"));
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
      const updatedEquipment = await service.delete(parseInt(id, 10));
      res.status(200).json(formatResponse(true, updatedEquipment, "Equipment deleted successfully"));
    } catch (error) {
      next(error);
    }

  });

module.exports = router;
