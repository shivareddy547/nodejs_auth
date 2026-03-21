'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    static associate(models) {
      OTP.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }

    isValid() {
      return !this.isUsed && new Date() < this.expiresAt;
    }
  }

  OTP.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('phone_verification', 'phone_login', 'password_reset'),
      allowNull: false
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isUsed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'OTP',
    indexes: [
      {
        fields: ['userId', 'otp', 'type']
      },
      {
        fields: ['expiresAt']
      }
    ]
  });

  return OTP;
};