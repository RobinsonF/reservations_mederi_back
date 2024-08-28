const { models } = require('../libs/sequelize');
const { Op } = require('sequelize');
const { fn, col, literal } = require('sequelize');

class ReportsService {

  constructor() {

  }

  async frequencyReport() {
    const reports = await models.Room.findAll({
      attributes: [
        'id',
        'name',
        [fn('COUNT', col('reservations.id')), 'reservationCount'],
        [fn('SUM', fn('TIMESTAMPDIFF', literal('HOUR'), col('reservations.start_time'), col('reservations.end_time'))), 'totalHoursReserved']
      ],
      include: [
        {
          model: models.Reservation,
          as: 'reservations',
          attributes: []
        }
      ],
      group: ['Room.id']
    });

    return reports;
  }

  async hoursReport() {
    const hoursReport = await models.Reservation.findAll({
      attributes: [
        'roomId',
        [fn('SUM', literal('TIMESTAMPDIFF(HOUR, start_time, end_time)')), 'totalHours']
      ],
      group: ['roomId'],
      where: {
        active: true,
      },
      include: [
        {
          model: models.Room,
          as: 'room',
          attributes: ['name']
        }
      ]
    });

    return hoursReport;

  }


  async dailyReport() {
    const dailyReport = await models.Reservation.findAll({
      attributes: [
        'roomId',
        [fn('SUM', literal('TIMESTAMPDIFF(HOUR, start_time, end_time)')), 'totalHours'],
        [fn('DATE', col('start_time')), 'reservationDate']
      ],
      group: ['roomId', 'reservationDate'],
      where: {
        active: true,

      },
      include: [
        {
          model: models.Room,
          as: 'room',
          attributes: ['name']
        }
      ]
    });

    return dailyReport;
  }

}

module.exports = ReportsService;
