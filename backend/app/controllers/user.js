const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

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
      d: "mp",
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
          token: jwt.sign({ userId: data._id }, "secrettoken", {
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

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, "secrettoken", { expiresIn: "24h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
