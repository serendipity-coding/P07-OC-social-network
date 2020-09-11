const db = require("../models");
const Post = db.posts;
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// @route  POST api/posts/new
// @desc   Creat post
// @acess  Private
exports.createPost = (req, res) => {
  const errors = validationResult(req);

  // check input
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // const token = req.headers.authorization.split(" ")[1];
    // const decodedToken = jwt.verify(token, "secrettoken");
    // const userId = decodedToken.userId;
    // console.log("decodedToken", decodedToken);

    // Create  and save a post
    Post.create({
      title: req.body.title,
      text: req.body.text,
      UserId: req.body.UserId,
      // UserId: userId,
    })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the post.",
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
// @route  GET api/posts
// @desc   Get all post
// @acess  Private
exports.findAll = (req, res) => {
  Post.findAll({
    include: ["users"],
    order: [["createdAt", "DESC"]],
  })
    .then((posts) => {
      res.send(posts);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving posts.",
      });
    });
};

// @route    GET api/posts/:id
// @desc     Get post by ID
// @access   Private
exports.findOne = (req, res) => {
  const id = req.params.id;

  Post.findByPk(id, { include: ["users"] })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving post with id=" + id,
      });
    });
};

// @route    PUT api/posts/:id
// @desc    Update post
// @access   Private
exports.update = (req, res) => {
  const id = req.params.id;

  Post.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "post was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update post with id=${id}. Maybe posts was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating post with id=" + id,
      });
    });
};

// @route    DELETE api/posts/:id
// @desc     Delete a post
// @access   Private
exports.delete = (req, res) => {
  const id = req.params.id;

  Post.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Post was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Post with id=${id}. Maybe Post was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Post with id=" + id,
      });
    });
};

// // Delete all posts from the database.
// exports.deleteAll = (req, res) => {
//   Post.destroy({
//     where: {},
//     truncate: false,
//   })
//     .then((nums) => {
//       res.send({ message: `${nums} posts were deleted successfully!` });
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: err.message || "Some error occurred while removing all posts.",
//       });
//     });
// };
