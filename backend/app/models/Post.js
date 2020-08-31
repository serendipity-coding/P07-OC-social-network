module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("Post", {
    title: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.STRING,
    },
  });

  // Post.associate = function (models) {
  //   models.Post.belongsTo(models.User, {
  //     foreignKey: {
  //       name: "UserId",
  //       allowNull: false,
  //     },
  //   });
  // };

  return Post;
};
