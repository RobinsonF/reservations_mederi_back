const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

class UsersService {

  constructor() {

  }

  async create(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async findAll() {
    const rta = await models.User.findAll({
      where: {
        active: true
      },
      attributes: { exclude: ['password', 'recoveryToken'] }
    });
    return rta;
  }

  async findByEmail(email) {
    const rta = await models.User.findOne({
      where: {
        email: email,
        active: true
      }
    });
    return rta;
  }

  async findRoleAndNotId(role, id) {
    const rta = await models.User.findAll({
      where: {
        id: {
          [Op.ne]: id
        }
      }
    });
    return rta;
  }

  async findOne(id) {
    const user = await models.User.findOne({
      where: {
        id: id,
        active: true
      },
      attributes: { exclude: ['password', 'recoveryToken'] },
      include: [{
        association: 'reservations',
        where: {
          active: true
        },
        required: false,
        include: ['room']
      }]
    });
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }

  async update(id, data) {
    const user = await this.findOne(id);
    const updatedUser = await user.update(data);
    return updatedUser;
  }

  async delete(id) {
    const user = await this.findOne(id);
    if (user.reservations.length !== 0) {
      throw boom.conflict('Cannot delete the user because it has pending reservations associated');
    }
    const deletedUser = await user.update({ active: false });
    return deletedUser;
  }
}

module.exports = UsersService;
