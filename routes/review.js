// ROUTES FOR REVIEWS

const express = require("express");
const router = express.Router({ mergeParams: true }); //to merge the parameters of the parent route
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js"); // function associated with each route


// REVIEWS (for the reviews in each listing)
// Post Review Route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;