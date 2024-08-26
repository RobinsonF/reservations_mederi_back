const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const { models } = require('../libs/sequelize');
const { config } = require('../config/config');
const UsersService = require('./user.service');
const service = new UsersService();

class AuthService {

  async createUser(data) {
    const hash = await bcrypt.hash(data.password, 10);
    const newUser = await models.User.create({
      ...data,
      password: hash,
      role: 'user',
      active: true
    });
    delete newUser.dataValues.password;
    return newUser;
  }

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMacth = await bcrypt.compare(password, user.password);
    if (!isMacth) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;

    return user;
  }

  async getProfile(user) {
    const profile = await service.findOne(user.sub);
    if (!profile) {
      throw boom.unauthorized();
    }
    delete profile.dataValues.password;
    delete profile.dataValues.reservations;
    delete profile.dataValues.recoveryToken;
    return profile;
  }

  singToken(user) {
    const payload = {
      sub: user.id,
      role: user.role
    }
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token
    };
  }

  async sendRecoveryPassword(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = {
      sub: user.id
    }
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `http://localhost:4200/recovery?token=${token}`;
    await service.update(user.id, {
      recoveryToken: token
    })
    const mail = {
      from: config.emailAccount,
      to: `${user.email}`,
      subject: 'Email para recuperar contraseña',
      html: `<b>Ingresa a este link: ${link} </b>`
    }
    const rta = await this.sendMail(mail);

    return rta;
  }

  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, {
        recoveryToken: null,
        password: hash
      });
      return { message: 'Password changed' }
    } catch (error) {
      throw boom.unauthorized();
    }
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      secure: true,
      port: 465,
      auth: {
        user: config.emailAccount,
        pass: config.emailPassword
      }
    });
    await transporter.sendMail(infoMail);
    return { message: 'Mail sent' }
  }

}

module.exports = AuthService;
