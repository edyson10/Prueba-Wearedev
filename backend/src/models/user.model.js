const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Usuario que puede autenticarse para obtener un JWT.
 * La contraseña nunca se guarda en texto plano: se hashea en el service (bcrypt)
 * antes de llegar aquí, y se excluye por defecto de las consultas (ver defaultScope).
 */
class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  }
);

module.exports = User;
