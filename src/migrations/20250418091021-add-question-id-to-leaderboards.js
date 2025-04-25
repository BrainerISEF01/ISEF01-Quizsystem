'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // add the new column question_id
    await queryInterface.addColumn('Leaderboards', 'question_id', {
      type: Sequelize.INTEGER,
      allowNull: true, 
      references: {
        model: 'Questions',  // Reference to the Questions table
        key: 'id',           // Reference to the ID column in the Questions table
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Inversion: Remove the question_id column
    await queryInterface.removeColumn('Leaderboards', 'question_id');
  }
};
