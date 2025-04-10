'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Question extends Model {}

  Question.init({
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: false
    },
    correctAnswer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Question',
    tableName: 'Questions', 
    timestamps: true 
  });

  return Question;
};
