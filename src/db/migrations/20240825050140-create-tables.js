'use strict';

const { userSchema, USER_TABLE } = require('../models/user.model');
const { roomSchema, ROOM_TABLE } = require('../models/room.model');
const { reservationSchema, RESERVATION_TABLE } = require('../models/reservation.model');
const { equipmentSchema, EQUIPMENT_TABLE } = require('../models/equipment.model');
const { roomEquipmentSchema, ROOM_EQUIPMENT_TABLE } = require('../models/room-equipment.model');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(USER_TABLE, userSchema);
    await queryInterface.createTable(ROOM_TABLE, roomSchema);
    await queryInterface.createTable(RESERVATION_TABLE, reservationSchema);
    await queryInterface.createTable(EQUIPMENT_TABLE, equipmentSchema);
    await queryInterface.createTable(ROOM_EQUIPMENT_TABLE, roomEquipmentSchema);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable(USER_TABLE);
    await queryInterface.dropTable(ROOM_TABLE);
    await queryInterface.dropTable(RESERVATION_TABLE);
    await queryInterface.dropTable(EQUIPMENT_TABLE);
    await queryInterface.dropTable(ROOM_EQUIPMENT_TABLE);
  }
};
