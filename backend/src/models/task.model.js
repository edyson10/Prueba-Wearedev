const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

const TASK_STATUSES = ['pending', 'in_progress', 'done'];

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: {
          args: [1, 100],
          msg: 'El título debe tener entre 1 y 100 caracteres',
        },
      },
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        len: {
          args: [0, 500],
          msg: 'La descripción no puede superar los 500 caracteres',
        },
      },
    },
    status: {
      type: DataTypes.ENUM(...TASK_STATUSES),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [TASK_STATUSES],
          msg: `El status debe ser uno de: ${TASK_STATUSES.join(', ')}`,
        },
      },
    },
  },
  {
    sequelize,
    modelName: 'Task',
    tableName: 'tasks',
    timestamps: true, // genera created_at y updated_at automáticamente
  }
);

module.exports = Task;
module.exports.TASK_STATUSES = TASK_STATUSES;
