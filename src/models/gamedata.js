'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GameData extends Model {
    static associate(models) {
      // define association here (optional)
    }
  }

  GameData.init({
    gameId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    timerDuration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    opponentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    opponentEmail: {
      type: DataTypes.STRING,
      allowNull: true
    },
    scoreUser: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    scoreOpponent: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'GameData',
    timestamps: true 
  });

  return GameData;
};
