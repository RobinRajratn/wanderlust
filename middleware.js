// THIS IS THE FILE FOR MIDDLEWARES THAT ARE BEING USED IN OTHER FILES

const Listing = require("./models/listing.js");
const Review = require("./models/review.js")
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// TO CHECK IF THE USER IS LOGGED IN
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; //after logging in go back to the path we were trying to access originally
        req.flash("error", "You must be logged in to create listing!");
        return res.redirect("/login");
    }
    next();
}


// TO SAVE THE ORIGINAL PATH THAT WE WERE TRYING TO ACCESS
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


// CHECK IF THE CURRENT USER IS THE OWNER OF THE LISTING
module.exports.isOwner = async(req, res, next)=>{
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner._id.equals(res.locals.currUser._id)) { // check if current user and owner is same before updating
        req.flash("error", "Permission denied! You are not the owner of this listing.");
        return res.redirect(`/listings/${id}`); // if we will not return then below operations will also be performed
    }
    next();
}


// VALIDATE LISTING USING JOI PACKAGE
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body); // validating the schema using JOI package
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", "); // to print additional details of the error (if any)
        throw new ExpressError(400, errMsg); // throwing error because of JOI
    } else {
        next();
    }
}


// VALIDATE REVIEW USING JOI PACKAGE
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body); // validating the schema using JOI package
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(", "); // to print additional details of the error (if any)
        throw new ExpressError(400, errMsg); // throwing error because of JOI
    } else {
        next();
    }
}


// CHECK IF THE CURRENT USER IS THE AUTHOR OF THE REVIEW
module.exports.isReviewAuthor = async(req, res, next)=>{
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author._id.equals(res.locals.currUser._id)) { // check if current user and owner is same before updating
        req.flash("error", "Permission denied! You are not the author of this review.");
        return res.redirect(`/listings/${id}`); // if we will not return then below operations will also be performed
    }
    next();
}