const { User, userSchema } = require('./user.model');
const { Reservation, reservationSchema } = require('./reservation.model');
const { Room, roomSchema } = require('./room.model');
const { RoomEquipment, roomEquipmentSchema } = require('./room-equipment.model');
const { Equipment, equipmentSchema } = require('./equipment.model');


function setupModels(sequelize){
  User.init(userSchema, User.config(sequelize));
  Reservation.init(reservationSchema, Reservation.config(sequelize));
  Room.init(roomSchema, Room.config(sequelize));
  RoomEquipment.init(roomEquipmentSchema, RoomEquipment.config(sequelize));
  Equipment.init(equipmentSchema, Equipment.config(sequelize));

  User.associate(sequelize.models);
  Room.associate(sequelize.models);
  Equipment.associate(sequelize.models);
  Reservation.associate(sequelize.models);
  RoomEquipment.associate(sequelize.models);
}

module.exports = setupModels;
