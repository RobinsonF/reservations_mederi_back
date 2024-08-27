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
    const rta = await models.Room.findAll({
      where: {
        active: true
      },
      include: [
        {
          association: 'reservations',
          where: {
            active: true,
            status: 'A'
          },
          required: false,
        }
      ]
    });
    return rta;
  }

  async findOne(id) {
    const room = await models.Room.findOne({
      include: [
        {
          association: 'reservations',
          where: {
            active: true,
            status: 'A'
          },
          required: false,
          include: [{
            association: 'user',
            attributes: { exclude: ['password', 'recoveryToken'] }
          }]
        },
        {
          association: 'equipment',
          where: {
            active: true
          },
          required: false,
        }
      ],
      where: {
        id: id,
        active: true
      }
    });
    if (!room) {
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
    if (room.reservations.length !== 0) {
      throw boom.conflict('Cannot delete the room because it has pending reservations associated');
    }
    if (room.equipment.length !== 0) {
      throw boom.conflict('Cannot delete the room because it has pending equipment associated');
    }
    const deletedRoom = await room.update({ active: false });
    return deletedRoom;
  }
}

module.exports = RoomsService;
