module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    name: Sequelize.STRING,
    email: Sequelize.STRING,
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
  // };

  return User;
};
