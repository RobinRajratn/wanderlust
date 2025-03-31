// TO ACCESS THE ENV FILE
if (process.env.NODE_ENV != "production") { // we use .env files in development not production
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose"); // MongoDB database
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
const ejsMate = require("ejs-mate"); // helps to create templates
const session = require("express-session"); // using sessions
const MongoStore = require("connect-mongo"); // storing session related info, should be used after express-session
const flash = require("connect-flash"); // send one time messages

const passport = require("passport"); // helps in authentication and authorization
const LocalStrategy = require("passport-local");

const listingRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const User = require("./models/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


// CONNECTING TO MONGO ATLAS
const dbUrl = process.env.ATLASDB_URL;

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(dbUrl);
}


// STORING THE SESSION RELATED INFO TO MONGO ATLAS
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: (24 * 3600), // info in seconds
});


store.on("error", () => { // if some error occurs
    console.log("ERROR in Mongo Session Store!", err);
});

// ADDING SESSIONS
const sessionOptions = {
    store, // mongo store related info
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (7 * 24 * 60 * 60 * 100), // expiry date in ms (7 days here)
        maxAge: 7 * 24 * 60 * 60 * 100,
        httpOnly: true,
    },
};


app.use(session(sessionOptions)); // using sessions
app.use(flash()); // we have to use flash before the routes for listing and reviews

// USING PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //to store user related info into the session
passport.deserializeUser(User.deserializeUser()); //to remove user related info from the session


// MIDDLEWARE TO DEFINE LOCAL VARIABLES
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next(); // if not called we'll be stuck in this middleware
});



// FOR LISTINGS
app.use("/listings", listingRouter);
// FOR REVIEWS (in each listing)
app.use("/listings/:id/reviews", reviewRouter); // here /:id parameter remains in app.js file only, it is not propagated forward
app.use("/", userRouter);



// FOR ALL THE OTHER ROUTES WHICH ARE NOT SPECIFIED ABOVE
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

// ERROR HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong :(" } = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
    console.log("Server is listening to port: 8080");
});