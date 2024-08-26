'use strict';

const { DataTypes } = require('sequelize');

const { USER_TABLE } = require('../models/user.model');
const { ROOM_TABLE } = require('../models/room.model');
const { RESERVATION_TABLE } = require('../models/reservation.model');
const { EQUIPMENT_TABLE } = require('../models/equipment.model');
const { ROOM_EQUIPMENT_TABLE } = require('../models/room-equipment.model');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE,
      {
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
        email: {
          allowNull: false,
          type: DataTypes.STRING,
          unique: true
        },
        password: {
          allowNull: false,
          type: DataTypes.STRING
        },
        recoveryToken: {
          field: 'recovery_token',
          allowNull: true,
          type: DataTypes.STRING
        },
        role: {
          allowNull: false,
          type: DataTypes.STRING
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
    );
    await queryInterface.createTable(ROOM_TABLE,
      {
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
    );
    await queryInterface.createTable(RESERVATION_TABLE,
      {
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

    );
    await queryInterface.createTable(EQUIPMENT_TABLE,
      {
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
    );
    await queryInterface.createTable(ROOM_EQUIPMENT_TABLE,
      {
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
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(ROOM_TABLE);
    await queryInterface.dropTable(RESERVATION_TABLE);
    await queryInterface.dropTable(EQUIPMENT_TABLE);
    await queryInterface.dropTable(ROOM_EQUIPMENT_TABLE);
  }
};
