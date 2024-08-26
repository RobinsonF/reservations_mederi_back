const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');

const AuthService = require('./auth.service');
const UsersService = require('./user.service');
const service = new AuthService();
const serviceUser = new UsersService();
const { config } = require('../config/config');

class ReservationsService {

  constructor() {

  }

  async create(data) {
    const { roomId, startTime, endTime } = data;
    const existingReservation = await models.Reservation.findOne({
      where: {
        roomId: roomId,
        active: true,
        status: 'A',
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startTime, endTime]
            }
          },
          {
            endTime: {
              [Op.between]: [startTime, endTime]
            }
          },
          {
            [Op.and]: [
              { startTime: { [Op.lte]: startTime } },
              { endTime: { [Op.gte]: endTime } }
            ]
          }
        ]
      }
    });
    if (existingReservation) {
      throw boom.conflict('The room is already reserved for the specified time period');
    }

    const newReservation = await models.Reservation.create(data);

    const reservation = await this.findOne(newReservation.dataValues.id);

    const mail = {
      from: config.emailAccount,
      to: `${reservation.user.email}`,
      subject: 'Reservación creada',
      html: `<b>Tu reservación para la sala ${reservation.room.name}
      ha sido creada de ${reservation.startTime} a ${reservation.endTime}.
      </b>`
    }
    await service.sendMail(mail);

    return newReservation;
  }

  async findAll(query) {
    const options = {
      include: [
        {
          association: 'user',
          attributes: { exclude: ['password', 'recoveryToken'] }
        }
        , 'room'],
      where: {
        active: true
      }
    }
    const { limit, offset } = query;
    if (limit && offset) {
      options.limit = parseInt(limit, 10);
      options.offset = parseInt(offset, 10);;
    }
    const rta = await models.Reservation.findAll(options);
    return rta;
  }

  async findOne(id) {
    const reservation = await models.Reservation.findOne({
      where: {
        id: id,
        active: true
      },
      include: [
        {
          association: 'user',
          attributes: { exclude: ['password', 'recoveryToken'] }
        }
        , 'room'],
    });
    if (!reservation) {
      throw boom.notFound('Reservation not found');
    }
    return reservation;
  }

  async update(id, data) {
    const { roomId, startTime, endTime, status } = data;
    const reservation = await this.findOne(id);
    if (roomId && startTime && endTime) {
      const conflictingReservation = await models.Reservation.findOne({
        where: {
          roomId: roomId,
          active: true,
          status: 'A',
          id: {
            [Op.ne]: id
          },
          [Op.or]: [
            {
              startTime: {
                [Op.between]: [startTime, endTime]
              }
            },
            {
              endTime: {
                [Op.between]: [startTime, endTime]
              }
            },
            {
              [Op.and]: [
                { startTime: { [Op.lte]: startTime } },
                { endTime: { [Op.gte]: endTime } }
              ]
            }
          ]
        }
      });
      if (conflictingReservation) {
        throw boom.conflict('The room is already reserved for the specified time period.');
      }
    }
    const updatedReservation = await reservation.update(data);
    const reservationUpdated = await this.findOne(updatedReservation.dataValues.id);

    if (status && status === 'C') {
      const mail = {
        from: config.emailAccount,
        to: `${reservationUpdated.user.email}`,
        subject: 'Reservación cancelada',
        html: `<b>Tu reservación para la sala ${reservationUpdated.room.name}
        ha sido cancelada.
        </b>`
      }
      await service.sendMail(mail);

      const userAvailable = await serviceUser.findRoleAndNotId('user', reservationUpdated.user.id);
      const toList = userAvailable.map(user => user.email).join(',');

      const mailAvailable = {
        from: config.emailAccount,
        to: toList,
        subject: `Sala ${reservationUpdated.room.name} ha sido liberada`,
        html: `<b>La sala ${reservationUpdated.room.name} se encuentra disponible en
        el horario de ${reservationUpdated.startTime} a ${reservationUpdated.endTime}.
        </b>`
      }
      await service.sendMail(mailAvailable);

    } else {
      const mail = {
        from: config.emailAccount,
        to: `${reservationUpdated.user.email}`,
        subject: 'Reservación actualizada',
        html: `<b>Tu reservación para la sala ${reservationUpdated.room.name}
        ha sido actualizada de ${reservationUpdated.startTime} a ${reservationUpdated.endTime}.
        </b>`
      }
      await service.sendMail(mail);
    }
    return updatedReservation;

  }

  async delete(id) {
    const reservation = await this.findOne(id);
    const deletedReservation = await reservation.update({ active: false });
    return deletedReservation;
  }
}

module.exports = ReservationsService;
