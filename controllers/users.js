// WHAT WORK TO DO WHEN REQ COMES TO USERS

const User = require("../models/user.js");


// FOR RENDERING SIGNUP FORM ROUTE
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// FOR SIGNUP ROUTE
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => { // automatically login after signup
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};


// FOR RENDERING LOGIN FORM ROUTE
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};


// FOR LOGIN ROUTE
// what to do after login, actual mei passport is helping in login
module.exports.login = async (req, res) => { //passport middleware to authenticate user
    req.flash("success", "Welcome to Wanderlust! You are logged in!");
    let redirectUrl = res.locals.redirectUrl || "/listings"; // check if redirectUrl exists in locals
    res.redirect(redirectUrl); //after logging in go back to the same path we were trying to access originally 
};


// FOR LOGOUT ROUTE
module.exports.logout = (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};