const { Model, DataTypes, Sequelize } = require('sequelize');


const ROOM_TABLE = 'rooms';

const roomSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.BIGINT
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING
  },
  location: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  capacity: {
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

class Room extends Model {
  static associate(models) {
    this.hasMany(models.Reservation, {
      as: 'reservations',
      foreignKey: 'roomId'
    });
    this.hasMany(models.RoomEquipment, {
      as: 'roomEquipment',
      foreignKey: 'roomId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ROOM_TABLE,
      modelName: 'Room',
      timestamps: false
    }
  }
}

module.exports = { ROOM_TABLE, roomSchema, Room };
