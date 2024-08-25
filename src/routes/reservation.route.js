const express = require('express');

const ReservationsService = require('../services/reservation.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createReservationSchema, updateReservationSchema, getReservationSchema } = require('../schemas/reservation.schema');

const router = express.Router();
const service = new ReservationsService();

router.get('/', async (req, res, next) => {
  try {
    const reservation = await service.findAll();
    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', validatorHandler(getReservationSchema, 'params'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const reservation = await service.findOne(parseInt(id, 10));
    res.json(reservation);
  } catch (error) {
    next(error);
  }
});

router.post('/', validatorHandler(createReservationSchema, 'body'), async (req, res, next) => {
  try {
    const body = req.body;
    const newReservation = service.create(body);
    res.status(201).json(newReservation);
  } catch (error) {
    next(error);
  }

});

router.put('/:id',
  validatorHandler(getReservationSchema, 'params'),
  validatorHandler(updateReservationSchema, 'body'), async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const updatedReservation = service.update(parseInt(id, 10), body);
    res.status(200).json(updatedReservation);
  } catch (error) {
    next(error);
  }

});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedReservation = service.delete(parseInt(id, 10));
    res.status(200).json(updatedReservation);
  } catch (error) {
    next(error);
  }

});

module.exports = router;
