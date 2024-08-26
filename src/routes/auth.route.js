const express = require('express');
const passport = require('passport');

const AuthService = require('../services/auth.service');
const validatorHandler = require('../middlewares/validator.handler');
const { createUserAuthSchema } = require('../schemas/user.schema');

const router = express.Router();
const service = new AuthService();

router.post('/register',
  validatorHandler(createUserAuthSchema),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.createUser(body);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }

  });

router.post('/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      res.json(service.singToken(user));
    } catch (error) {
      next(error);
    }

  });

router.get('/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const profileUser = await service.getProfile(user);
      res.json(profileUser);
    } catch (error) {
      next(error);
    }

  });


router.post('/recovery',
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const rta = await service.sendRecoveryPassword(email);
      res.json(rta)
    } catch (error) {
      next(error);
    }
  });

router.post('/change-password',
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const rta = await service.changePassword(token, newPassword);
      res.json(rta)
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
