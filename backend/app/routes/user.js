const { check, validationResult } = require("express-validator");

module.exports = (app) => {
  const userCtrl = require("../controllers/user.js");
  var router = require("express").Router();
  const auth = require('../middleware/auth')

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
  //get all users for admin
  router.get("/users", auth, userCtrl.getAllUsers)

  //Delete one user for admin
  router.delete("/users/:id", auth, userCtrl.deleteUser);

  // // Update a post with id
  router.put("/users/:id",
    auth,
    userCtrl.update);

  app.use("/api/auth", router);
};
