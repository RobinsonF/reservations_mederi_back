const express = require('express');
const passport = require('passport');

const ReportsService = require('../services/report.service');
const { checkRoles } = require('../middlewares/auth.handler');
const formatResponse = require('../utils/response/response-formatter');

const router = express.Router();
const service = new ReportsService();

router.get('/frequencyReport',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const frequencyReport = await service.frequencyReport();
      res.json(formatResponse(true, frequencyReport, "frequencyReport"));
    } catch (error) {
      next(error);
    }
  });

router.get('/hoursReport',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const hoursReport = await service.hoursReport();
      res.json(formatResponse(true, hoursReport, "hoursReport"));
    } catch (error) {
      next(error);
    }
  });

router.get('/dailyReport',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const dailyReport = await service.dailyReport();
      res.json(formatResponse(true, dailyReport, "dailyReport"));
    } catch (error) {
      next(error);
    }
  });

module.exports = router;



