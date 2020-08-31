module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    title: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.STRING,
    },
  });

  // Post.associate = function (models) {
  //   models.Post.belongsTo(models.User, {
  //     onDelete: "CASCADE",
  //     hooks: true,
  //   });
  //   models.Post.hasMany(models.Comment, {
  //     onDelete: "CASCADE",
  //   });
  // };

  return Post;
};
