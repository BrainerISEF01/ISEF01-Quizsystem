'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GameData', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.STRING
      },
      userEmail: {
        type: Sequelize.STRING
      },
      mode: {
        type: Sequelize.STRING
      },
      timerDuration: {
        type: Sequelize.INTEGER
      },
      opponentId: {
        type: Sequelize.STRING
      },
      opponentEmail: {
        type: Sequelize.STRING
      },
      scoreUser: {
        type: Sequelize.INTEGER
      },
      scoreOpponent: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GameData');
  }
};