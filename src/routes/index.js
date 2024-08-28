const express = require('express');

const roomRouter = require('./room.route');
const userRouter = require('./user.route');
const reservationRouter = require('./reservation.route');
const equipmentRouter = require('./equipment.route');
const roomEquipmentRouter = require('./room-equipment.route');
const authRouter = require('./auth.route');
const reportRouter = require('./report.route');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use('/rooms', roomRouter);
  router.use('/users', userRouter);
  router.use('/reservations', reservationRouter);
  router.use('/equipment', equipmentRouter);
  router.use('/room-equipment', roomEquipmentRouter);
  router.use('/auth', authRouter);
  router.use('/reports', reportRouter);
}

module.exports = routerApi;
