'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Leaderboards', 'quiz_id', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Leaderboards', 'quiz_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
