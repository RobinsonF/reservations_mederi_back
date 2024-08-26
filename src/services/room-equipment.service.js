const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class RoomEquipmentService {

  constructor() {

  }

  async create(data) {
    const isRegister = await this.findByRoomIdAndEquipmentId(data.roomId, data.equipmentId);
    if (isRegister) {
      throw boom.conflict('The resource is already registered');
    }
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
    if (!roomEquipment) {
      throw boom.notFound('Room equipment not found');
    }
    return roomEquipment;
  }

  async findByRoomIdAndEquipmentId(roomId, equipmentId) {
    const roomEquipment = await models.RoomEquipment.findOne({
      where: {
        roomId: roomId,
        equipmentId: equipmentId
      }
    });
    return roomEquipment;
  }

  async update(id, data) {
    const roomEquipment = await this.findOne(id);
    if(data.roomId && data.equipmentId){
      const isRegister = await this.findByRoomIdAndEquipmentId(data.roomId, data.equipmentId);
      if (isRegister) {
        throw boom.conflict('The resource is already registered');
      }
    }
    const updatedRoomEquipment = await roomEquipment.update(data);
    return updatedRoomEquipment;
  }

  async delete(id) {
    const roomEquipment = await this.findOne(id);
    await roomEquipment.destroy();
    return roomEquipment;
  }
}

module.exports = RoomEquipmentService;
