const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class EquipmentService {

  constructor() {

  }

  async create(data) {
    const newEquipment = await models.Equipment.create(data);
    return newEquipment;
  }

  async findAll() {
    const rta = await models.Equipment.findAll();
    return rta;
  }

  async findOne(id) {
    const equipment = await models.Equipment.findByPk(id);
    if(!equipment){
      throw boom.notFound('Equipment not found');
    }
    return equipment;
  }

  async update(id, data) {
    const equipment = await this.findOne(id);
    const updatedEquipment = await equipment.update(data);
    return updatedEquipment;
  }

  async delete(id) {
    const equipment = await this.findOne(id);
    const deletedEquipment = await equipment.update({active: false});
    return deletedEquipment;
  }
}

module.exports = EquipmentService;
