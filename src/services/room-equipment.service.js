const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class RoomEquipmentService {

  constructor() {

  }

  async create(data) {
    const newRoomEquipment = await models.RoomEquipment.create(data);
    return newRoomEquipment;
  }

  async findAll() {
    const rta = await models.RoomEquipment.findAll({
      include: ['room', 'equipment']
    });
    return rta;
  }

  async findOne(id) {
    const roomEquipment = await models.RoomEquipment.findByPk(id);
    if(!roomEquipment){
      throw boom.notFound('Room equipment not found');
    }
    return roomEquipment;
  }

  async update(id, data) {
    const roomEquipment = await this.findOne(id);
    const updatedRoomEquipment = await roomEquipment.update(data);
    return updatedRoomEquipment;
  }

  async delete(id) {
    const roomEquipment = await this.findOne(id);
    const deletedRoomEquipment = await roomEquipment.update({active: false});
    return deletedRoomEquipment;
  }
}

module.exports = RoomEquipmentService;
