const express = require('express');
const passport = require('passport');

const UsersService = require('../services/user.service');
const validatorHandler = require('../middlewares/validator.handler');
const { checkRoles } = require('../middlewares/auth.handler');
const { createUserSchema, updateUserSchema, getUserSchema } = require('../schemas/user.schema');
const formatResponse = require('../utils/response/response-formatter');

const router = express.Router();
const service = new UsersService();

router.get('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  async (req, res, next) => {
    try {
      const users = await service.findAll();
      res.json(formatResponse(true, users, "Users obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.get('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getUserSchema, 'params'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await service.findOne(parseInt(id, 10));
      res.json(formatResponse(true, user, "User obtained successfully"));
    } catch (error) {
      next(error);
    }
  });

router.post('/',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createUserSchema, 'body'), async (req, res, next) => {
    try {
      const body = req.body;
      const newUser = await service.create(body);
      res.status(201).json(formatResponse(true, newUser, "User created successfully"));
    } catch (error) {
      next(error);
    }

  });

router.put('/:id',
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(getUserSchema, 'paramas'),
  validatorHandler(updateUserSchema, 'body'), async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const updatedUser = await service.update(parseInt(id, 10), body);
      res.status(200).json(formatResponse(true, updatedUser, "User updated successfully"));
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
      const updatedUser = await service.delete(parseInt(id, 10));
      res.status(200).json(formatResponse(true, updatedUser, "User deleted successfully"));
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
