const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require('../config/jwt.secret') // On récupère la clé pour le TOKEN

// @route  POST api/users
// @desc   register user
// @acess  Public
exports.signup = async (req, res) => {
  //check input errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { name, email, password } = req.body;

  try {
    //check if user exists
    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (user) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }
    // Get users gravatar
    const avatar = gravatar.url(email, {
      s: "200", //size
      r: "pg",
      d: "monsterid",
    });
    //Encrypt password
    const salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = {
      name,
      email,
      password,
      avatar,
    };

    // Save new user in the database
    User.create(newUser)
      .then((data) => {
        // res.send(data);
        res.status(201).json({
          data,
          token: jwt.sign({ userId: data.id }, config.secret, {
            expiresIn: "24h",
          }),
        });
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user.",
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route  GET api/auth
// @desc   Get user by token
// @acess  Public
exports.login = async (req, res) => {
  //check input errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    //compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }
    let data = user;

    jwt.sign({ userId: user.id }, config.secret, { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({ data, token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route  GET api/auth/users
// @desc   Get user by token
// @acess  private
exports.getAllUsers = (req, res, next) => {
  User.findAll({
    order: [["createdAt", "DESC"]],
  })
    .then(users => {
      res.status(200).json(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retreiving users",
      });
    });
}

// @route  GET api/auth/users/:user_id
// @desc   Get user by token
// @acess  private
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

// @route    PUT api/auth/users/:user_id
// @desc    Update user
// @access   Private
// exports.update = (req, res) => {
//   const id = req.params.id;

//   User.update(req.body, {
//     where: { id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "User was updated successfully.",
//         });
//       } else {
//         res.send({
//           message: `Cannot update user with id=${id}. Maybe user was not found or req.body is empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       res.status(500).send({
//         message: "Error updating user with id=" + id,
//       });
//     });
// };


exports.update = async (req, res) => {
  const email = req.body.email
  const name = req.body.name
  const id = req.params.id
  let password = req.body.password
  //hash the new password
  bcrypt.hash(password, 10)
    .then((hash) => {
      password = hash;
      //update the user by id
      User.update({ email, name, password },
        {
          where: { id: id },
        })
        .then(function () {
          //find and retreive the new user
          User.findByPk(id)
            .then(function (result) {
              let data = result;
              jwt.sign({ userId: data.id }, config.secret, { expiresIn: "24h" }, (err, token) => {
                if (err) throw err;
                res.json({ data, token });
              });
            })
            .catch(function (err) {
              console.log(err)
            });
        })
    });









};