module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    name: {
      type: DataTypes.STRING,
    },
    text: {
      type: DataTypes.STRING,
    },
  });
  // Comment.associate = function (models) {
  //   models.Comment.belongsTo(models.Post, {
  //     onDelete: "CASCADE",
  //     hooks: true,
  //   });
  //   models.Comment.belongsTo(models.User, {
  //     onDelete: "CASCADE",
  //     hooks: true,
  //   });
  // };
  return Comment;
};
