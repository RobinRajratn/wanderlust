// ROUTES FOR USERS

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

// FOR SIGNUP
router.route("/signup")
    .get(userController.renderSignupForm) //render signup form
    .post(wrapAsync(userController.signup));


// FOR LOGIN
router.route("/login")
    .get(userController.renderLoginForm) //render login form
    .post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);


// FOR LOGOUT
router.get("/logout", userController.logout);

module.exports = router;