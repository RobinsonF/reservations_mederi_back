const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class UsersService {

  constructor() {

  }

  async create(data) {
    const newUser = await models.User.create(data);
    return newUser;
  }

  async findAll() {
    const rta = await models.User.findAll();
    return rta;
  }

  async findOne(id) {
    const user = await models.User.findByPk(id);
    if(!user){
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
    const deletedUser = await user.update({active: false});
    return deletedUser;
  }
}

module.exports = UsersService;
