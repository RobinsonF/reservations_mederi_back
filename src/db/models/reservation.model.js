const { Model, DataTypes, Sequelize } = require('sequelize');

const { ROOM_TABLE } = require('./room.model');
const { USER_TABLE } = require('./user.model');

const RESERVATION_TABLE = 'reservations';

const reservationSchema = {
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
  userId: {
    allowNull: false,
    type: DataTypes.BIGINT,
    field: 'user_id',
    references: {
      model: USER_TABLE,
      key: 'id'
    },
    onUpdate: 'CASCADE'
  },
  startTime: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'start_time',
  },
  endTime: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'end_time',
  },
  purpose: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  status: {
    allowNull: false,
    type: DataTypes.CHAR,
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

class Reservation extends Model {
  static associate(models) {
    this.belongsTo(models.User, { as: 'user' });
    this.belongsTo(models.Room, { as: 'room' });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: RESERVATION_TABLE,
      modelName: 'Reservation',
      timestamps: false
    }
  }
}

module.exports = { RESERVATION_TABLE, reservationSchema, Reservation };
