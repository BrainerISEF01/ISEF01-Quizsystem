'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Question extends Model {
    static associate(models) {
      //One question has many leaderboard entries (or quizzes)
      this.hasMany(models.Leaderboard, {
        foreignKey: 'question_id', // Foreign keys in the leaderboard table
        as: 'leaderboards',        // Alias ​​to reference the relationship
      });
    }
  }

  Question.init({
    question: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'Questions',
    timestamps: true,
  });

  return Question;
};
