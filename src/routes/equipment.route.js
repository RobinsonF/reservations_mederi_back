const express = require('express');

const EquipmentService = require('../services/equipment.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createEquipmentSchema, updateEquipmentSchema, getEquipmentSchema } = require('../schemas/equipment.schema');

const router = express.Router();
const service = new EquipmentService();

router.get('/', async (req, res, next) => {
  try {
    const equipment = await service.findAll();
    res.json(equipment);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getEquipmentSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const equipment = await service.findOne(parseInt(id, 10));
    res.json(equipment);
  } catch (error) {
    next(error);
  }
});

router.post('/', validatorHandler(createEquipmentSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body;
    const newEquipment = await service.create(body);
    res.status(201).json(newEquipment);
  } catch (error) {
    next(error);
  }

});

router.put('/:id',
  validatorHandler(getEquipmentSchema, 'params'),
  validatorHandler(updateEquipmentSchema, 'body'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedEquipment = await service.update(parseInt(id, 10), body);
    res.status(200).json(updatedEquipment);
  } catch (error) {
    next(error);
  }

});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedEquipment = await service.delete(parseInt(id, 10));
    res.status(200).json(updatedEquipment);
  } catch (error) {
    next(error);
  }

});

module.exports = router;
