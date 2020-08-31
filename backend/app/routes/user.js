const { check, validationResult } = require("express-validator");

module.exports = (app) => {
  const userCtrl = require("../controllers/user.js");
  var router = require("express").Router();

  // Regsiter as new user
  router.post(
    "/signup",
    [
      check("name", "Name is required").not().isEmpty(), //validate input with express validator
      check("email", "Please include a valide email").isEmail(),
      check(
        "password",
        "Please enter a password with 6 or more characters"
      ).isLength({ min: 6 }),
    ],
    userCtrl.signup
  );
  // Login user
  router.post(
    "/login",
    [
      check("email", "Please include a valid email").isEmail(),
      check("password", "Password is required").exists(),
    ],
    userCtrl.login
  );

  app.use("/api/users", router);
};
