module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("Comment", {
    content: {
      type: Sequelize.STRING,
    },
  });
  // Comment.associate = function (models) {
  //   models.Comment.belongsTo(models.Post, {
  //     onDelete: "CASCADE",
  //     hooks: true,
  //     foreignKey: {
  //       name: "PostId",
  //       allowNull: false,
  //     },
  //   });
  //   models.Comment.belongsTo(models.User, {
  //     onDelete: "CASCADE",
  //     hooks: true,
  //     foreignKey: {
  //       name: "UserId",
  //       allowNull: false,
  //     },
  //   });
  // };
  return Comment;
};
