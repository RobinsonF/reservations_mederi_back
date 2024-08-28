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
        [Sequelize.fn('SUM', Sequelize.literal('TIMESTAMPDIFF(HOUR, startTime, endTime)')), 'totalHours']
      ],
      group: ['roomId'],
      where: {
        active: true,
        status: 'A',
        createdAt: {
          [Op.between]: [startDate, endDate]
        }
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
        [Sequelize.fn('SUM', Sequelize.literal('TIMESTAMPDIFF(HOUR, startTime, endTime)')), 'totalHours'],
        [Sequelize.fn('DATE', Sequelize.col('startTime')), 'reservationDate']
      ],
      group: ['roomId', 'reservationDate'],
      where: {
        active: true,
        status: 'A',
        startTime: {
          [Op.between]: [startDate, endDate]
        }
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
