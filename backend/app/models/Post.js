module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("Post", {
    title: {
      type: Sequelize.STRING,
    },
    text: {
      type: Sequelize.STRING,
    },
  });
  return Post;
};
