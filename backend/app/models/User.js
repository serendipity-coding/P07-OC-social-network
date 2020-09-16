module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    name: {
      type: Sequelize.STRING,
      unique: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true
    },
    password: Sequelize.STRING,
    avatar: Sequelize.STRING,
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  });

  // User.associate = function (models) {
  //   models.User.hasMany(models.Post, {
  //     onDelete: "CASCADE",
  //     hooks: true,
  //   });
  //   models.User.hasMany(models.Comment, {
  //     onDelete: "CASCADE",
  //     hooks: true,
  //   });
  // };

  return User;
};
