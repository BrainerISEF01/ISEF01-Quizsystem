'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Leaderboard extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  // Defines the model
  Leaderboard.init({
    user_id: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    quiz_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mode_name: {
      type: DataTypes.STRING,
      allowNull: true, 
    }
  }, {
    sequelize,
    modelName: 'Leaderboard',
  });

  return Leaderboard;
};
