const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class ReservationsService {

  constructor() {

  }

  async create(data) {
    const newReservation = await models.Reservation.create(data);
    return newReservation;
  }

  async findAll() {
    const rta = await models.Reservation.findAll();
    return rta;
  }

  async findOne(id) {
    const reservation = await models.Reservation.findByPk(id);
    if(!reservation){
      throw boom.notFound('Reservation not found');
    }
    return reservation;
  }

  async update(id, data) {
    const reservation = await this.findOne(id);
    const updatedReservation = await reservation.update(data);
    return updatedReservation;
  }

  async delete(id) {
    const reservation = await this.findOne(id);
    const deletedReservation = await reservation.update({active: false});
    return deletedReservation;
  }
}

module.exports = ReservationsService;
