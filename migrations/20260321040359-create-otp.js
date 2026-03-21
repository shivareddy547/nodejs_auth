'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('OTPs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      otp: {
        type: Sequelize.STRING,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('phone_verification', 'phone_login', 'password_reset'),
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      isUsed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('OTPs', ['userId', 'otp', 'type']);
    await queryInterface.addIndex('OTPs', ['expiresAt']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OTPs');
    // Drop ENUM type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_OTPs_type";');
  }
};