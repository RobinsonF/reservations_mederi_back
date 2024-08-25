const { Model, DataTypes, Sequelize } = require('sequelize');


const EQUIPMENT_TABLE = 'equipment';

const equipmentSchema = {
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
  description: {
    allowNull: false,
    type: DataTypes.STRING,
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

class Equipment extends Model {
  static associate(models) {
    this.hasMany(models.RoomEquipment, {
      as: 'roomEquipment',
      foreignKey: 'equipmentId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: EQUIPMENT_TABLE,
      modelName: 'Equipment',
      timestamps: false
    }
  }
}

module.exports = { EQUIPMENT_TABLE, equipmentSchema, Equipment };
