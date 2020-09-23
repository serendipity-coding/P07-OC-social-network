const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const commentCtrl = require("../controllers/comment");
var router = require("express").Router();

module.exports = (app) => {

  // // Create a new comment
  router.post("/:id/new", auth, [check("content", "content is required").not().isEmpty()], commentCtrl.createComment);
  // // Retrieve all comments
  router.get("/", auth, commentCtrl.findAllComments);
  // // Retrieve last comment
  router.get("/:post_id", auth, commentCtrl.findLastComment);
  // // Update a comment with id
  router.put("/:id", auth, commentCtrl.updateComment);
  // // Delete a post with id
  router.delete("/:id", auth, commentCtrl.deleteComment);

  app.use("/api/comments", router);
};
