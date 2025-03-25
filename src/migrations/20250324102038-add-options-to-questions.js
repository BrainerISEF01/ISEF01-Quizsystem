'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Questions', 'options', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Questions', 'options');
  }
};
