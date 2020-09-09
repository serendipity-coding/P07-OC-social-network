const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = require("./Post.js")(sequelize, Sequelize);
db.users = require("./User.js")(sequelize, Sequelize);
db.comments = require("./Comment.js")(sequelize, Sequelize);

db.users.hasMany(db.posts, { as: "posts" });
db.users.hasMany(db.comments, { as: "comments" });
db.posts.belongsTo(db.users, {
  foreignKey: "UserId",
  allowNull: false,
  as: "users",
});

db.comments.belongsTo(db.users, {
  foreignKey: "UserId",
  allowNull: false,
  as: "users",
});
db.comments.belongsTo(db.posts, {
  foreignKey: "PostId",
  allowNull: false,
  as: "posts",
});

module.exports = db;
