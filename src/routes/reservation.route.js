const express = require('express');
const passport = require('passport');

const ReservationsService = require('../services/reservation.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createReservationSchema, updateReservationSchema, getReservationSchema, queryReservationSchema } = require('../schemas/reservation.schema');
const formatResponse = require('../utils/response/response-formatter');

const router = express.Router();
const service = new ReservationsService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(queryReservationSchema, 'query'), async (req, res, next) => {
    try {
      const reservation = await service.findAll(req.query);
      res.json(formatResponse(true, reservation, "Reservations obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(getReservationSchema, 'params'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const reservation = await service.findOne(parseInt(id, 10));
      res.json(formatResponse(true, reservation, "Reservation obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(createReservationSchema, 'body'), async (req, res, next) => {
    try {
      const body = req.body;
      const newReservation = await service.create(body);
      res.status(201).json(formatResponse(true, newReservation, "Reservation created successfully"));
    } catch (error) {
      next(error);
    }

  });

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin', 'user'),
  validatorHandler(getReservationSchema, 'params'),
  validatorHandler(updateReservationSchema, 'body'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedReservation = await service.update(parseInt(id, 10), body);
      res.status(200).json(formatResponse(true, updatedReservation, "Reservation updated successfully"));
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
      const updatedReservation = await service.delete(parseInt(id, 10));
      res.status(200).json(formatResponse(true, updatedReservation, "Reservation deleted successfully"));
    } catch (error) {
      next(error);
    }

  });

module.exports = router;
