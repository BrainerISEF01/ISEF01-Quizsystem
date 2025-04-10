'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Leaderboards', 'user_id', {
            type: Sequelize.STRING, // change to string
            allowNull: false,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('Leaderboards', 'user_id', {
            type: Sequelize.INTEGER, // if it needs to be reset
            allowNull: false,
        });
    }
};
