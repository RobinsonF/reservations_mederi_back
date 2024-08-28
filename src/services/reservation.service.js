const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');
const { format } = require('date-fns');

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

    const formattedStartTime = format(reservation.startTime, 'dd/MM/yyyy HH:mm');
    const formattedEndTime = format(reservation.endTime, 'dd/MM/yyyy HH:mm');

    const htmlContent = await service.getEmailHtml('../templates/email.html', {
      title: 'Reservación creada',
      userName: reservation.user.name,
      text: `Tu reservación para la sala <b>${reservation.room.name}</b> ha sido creada para el  ${formattedStartTime} a  ${formattedEndTime}.`
    });

    const mail = {
      from: config.emailAccount,
      to: `${reservation.user.email}`,
      subject: 'Reservación creada',
      html: htmlContent
    }
    await service.sendMail(mail);

    return reservation;
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

    const formattedStartTime = format(reservationUpdated.startTime, 'dd/MM/yyyy HH:mm');
    const formattedEndTime = format(reservationUpdated.endTime, 'dd/MM/yyyy HH:mm');


    if (status && status === 'C') {
      const htmlContent = await service.getEmailHtml('../templates/email.html', {
        title: 'Reservación cancelada',
        userName: reservationUpdated.user.name,
        text: `Tu reservación para la sala <b>${reservationUpdated.room.name}</b> ha sido cancelada.`
      });
      const mail = {
        from: config.emailAccount,
        to: `${reservationUpdated.user.email}`,
        subject: 'Reservación cancelada',
        html: htmlContent
      }
      await service.sendMail(mail);

      const userAvailable = await serviceUser.findRoleAndNotId('user', reservationUpdated.user.id);
      const toList = userAvailable.map(user => user.email).join(',');

      const htmlContentAvailable = await service.getEmailHtml('../templates/email.html', {
        title: `Sala ${reservationUpdated.room.name} ha sido liberada`,
        userName: reservationUpdated.user.name,
        text: `La sala <b>${reservation.room.name}</b> se encuentra disponible en el horario de  ${formattedStartTime} a  ${formattedEndTime}.`
      });

      const mailAvailable = {
        from: config.emailAccount,
        to: toList,
        subject: `Sala ${reservationUpdated.room.name} ha sido liberada`,
        html: htmlContentAvailable
      }
      await service.sendMail(mailAvailable);

    } else {
      const htmlContent = await service.getEmailHtml('../templates/email.html', {
        title: 'Reservación actualizada',
        userName: reservationUpdated.user.name,
        text: `Tu reservación para la sala <b>${reservation.room.name}</b> ha sido actualizada para el  ${formattedStartTime} a  ${formattedEndTime}.`
      });
      const mail = {
        from: config.emailAccount,
        to: `${reservationUpdated.user.email}`,
        subject: 'Reservación actualizada',
        html: htmlContent
      }
      await service.sendMail(mail);
    }
    return reservationUpdated;

  }

  async delete(id) {
    const reservation = await this.findOne(id);
    const deletedReservation = await reservation.update({ active: false });
    return deletedReservation;
  }
}

module.exports = ReservationsService;
