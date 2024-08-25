const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class RoomsService {

  constructor() {

  }

  async create(data) {
    const newRoom = await models.Room.create(data);
    return newRoom;
  }

  async findAll() {
    const rta = await models.Room.findAll();
    return rta;
  }

  async findOne(id) {
    const room = await models.Room.findByPk(id, {
      include: ['reservations', 'roomEquipment']
    });
    if(!room){
      throw boom.notFound('Room not found');
    }
    return room;
  }

  async update(id, data) {
    const room = await this.findOne(id);
    const updatedRoom = await room.update(data);
    return updatedRoom;
  }

  async delete(id) {
    const room = await this.findOne(id);
    const deletedRoom = await room.update({active: false});
    return deletedRoom;
  }
}

module.exports = RoomsService;
