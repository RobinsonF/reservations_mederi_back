const { Model, DataTypes, Sequelize } = require('sequelize');

const { ROOM_TABLE } = require('./room.model');
const { EQUIPMENT_TABLE } = require('./equipment.model');

const ROOM_EQUIPMENT_TABLE = 'room_equipment';

const roomEquipmentSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  roomId: {
    allowNull: false,
    type: DataTypes.BIGINT,
    field: 'room_id',
    references: {
      model: ROOM_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE'
  },
  equipmentId: {
    allowNull: false,
    type: DataTypes.BIGINT,
    field: 'equipment_id',
    references: {
      model: EQUIPMENT_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE'
  },
  quantity: {
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'create_at',
    defaultValue: Sequelize.NOW
  },
  active: {
    allowNull: false,
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}

class RoomEquipment extends Model {
  static associate(models) {
    this.belongsTo(models.Room, { as: 'room' });
    this.belongsTo(models.Equipment, { as: 'equipment' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROOM_EQUIPMENT_TABLE,
      modelName: 'RoomEquipment',
      timestamps: false
    }
  }
}

module.exports = { ROOM_EQUIPMENT_TABLE, roomEquipmentSchema, RoomEquipment };
