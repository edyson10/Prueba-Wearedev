const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

async function login(username, password) {
  // Usamos el scope "withPassword" porque el defaultScope del modelo excluye la contraseña
  const user = await User.scope('withPassword').findOne({ where: { username } });

  if (!user) {
    throw ApiError.unauthorized('Usuario o contraseña incorrectos');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw ApiError.unauthorized('Usuario o contraseña incorrectos');
  }

  const token = jwt.sign({ sub: user.id, username: user.username }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

  return {
    token,
    user: { id: user.id, username: user.username },
  };
}

async function createUser(username, plainPassword) {
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  return User.create({ username, password: passwordHash });
}

module.exports = { login, createUser };
