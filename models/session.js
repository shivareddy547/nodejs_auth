'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      Session.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }

  Session.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    userAgent: {
      type: DataTypes.STRING
    },
    ipAddress: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Session',
    indexes: [
      {
        fields: ['refreshToken']
      },
      {
        fields: ['userId']
      }
    ]
  });

  return Session;
};