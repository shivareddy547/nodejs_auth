'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sessions', {
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
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP + INTERVAL '7 days'")
      },
      userAgent: {
        type: Sequelize.STRING
      },
      ipAddress: {
        type: Sequelize.STRING
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

    // Add index for faster queries
    await queryInterface.addIndex('Sessions', ['refreshToken']);
    await queryInterface.addIndex('Sessions', ['userId']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sessions');
  }
};