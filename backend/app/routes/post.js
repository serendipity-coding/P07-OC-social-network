const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
module.exports = (app) => {
  const postCtrl = require("../controllers/post.js");

  var router = require("express").Router();

  // Create a new Post
  router.post(
    "/new",
    // auth,
    [check("text", "Text is required").not().isEmpty()],
    postCtrl.createPost
  );

  // // Retrieve all posts
  router.get(
    "/",
    // auth,
    postCtrl.findAll
  );

  // // Retrieve a single post with id
  router.get(
    "/:id",
    //  auth,
    postCtrl.findOne
  );

  // // Update a post with id
  router.put("/:id",
    // auth, 
    postCtrl.update);

  // // Delete a post with id
  router.delete("/:id", auth, postCtrl.delete);

  // // Delete all posts
  // router.delete("/", auth, postCtrl.deleteAll);

  app.use("/api/posts", router);
};
