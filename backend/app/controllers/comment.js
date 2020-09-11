const db = require("../models");
const Post = db.posts;
const Comment = db.comments;
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// @route  POST api/comments/:postId/new
// @desc   Add comment
// @acess  Private
exports.createComment = (req, res) => {
  const errors = validationResult(req);

  // check input
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // const token = req.headers.authorization.split(" ")[1];
    // const decodedToken = jwt.verify(token, "secrettoken");
    // const userId = decodedToken.user.id;
    // console.log("token", userId);

    // Create  and save a post
    Comment.create({
      content: req.body.content,
      // UserId: userId,
      UserId: req.body.UserId,
      PostId: req.params.id,
    })
      .then((comment) => {
        res.send(comment);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the comment.",
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route  GET api/comments
// @desc   Get all comments
// @acess  Private
exports.findAllComments = (req, res) => {
  Comment.findAll({
    include: ["users", "posts"],
    order: [["createdAt", "DESC"]],
  })
    .then((comments) => {
      res.send(comments);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving comments.",
      });
    });
};

// @route    PUT api/comments/:commentId
// @desc    Update comment
// @access   Private
exports.updateComment = (req, res) => {
  const id = req.params.id;

  Comment.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "comment was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update comment with id=${id}. Maybe posts was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating post with id=" + id,
      });
    });
};

// @route    DELETE api/comments/:id
// @desc     Delete a comment
// @access   Private
exports.deleteComment = (req, res) => {
  const id = req.params.id;

  Comment.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Comment was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Comment with id=" + id,
      });
    });
};

// @route  GET api/comments/post_id
// @desc   Get last comment of a post
// @acess  Private
exports.findLastComment = (req, res) => {
  const id = req.params.post_id;
  Comment.findAll({
    limit: 1,
    where: {
      PostId: id
    },
    include: ["users", "posts"],
    order: [["createdAt", "DESC"]],
  })
    .then((comment) => {
      res.send(comment);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving comment.",
      });
    });
};
