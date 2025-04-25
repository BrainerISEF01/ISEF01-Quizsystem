'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Leaderboard extends Model {}

  Leaderboard.init({
    user_id: {
      type: DataTypes.INTEGER,
    },
    quiz_id: {
      type: DataTypes.INTEGER,
    },
    score: {
      type: DataTypes.INTEGER,
    },
    mode_name: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Leaderboard',
    tableName: 'Leaderboards',
    timestamps: true,
  });

  Leaderboard.associate = function(models) {
    // Association to Question: A leaderboard has a question
    Leaderboard.belongsTo(models.Question, {
      foreignKey: 'question_id',
      as: 'question',  // Alias ​​for the association
    });
  };

  return Leaderboard;
};
