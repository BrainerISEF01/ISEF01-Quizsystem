module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }
  });

  User.associate = (models) => {
    User.hasMany(models.Question, { foreignKey: "created_by" });
    User.hasMany(models.Leaderboard, { foreignKey: "user_id" });
  };

  return User;
};
