// WHAT WORK TO DO WHEN REQ COMES TO REVIEWS

const Listing = require("../models/listing");
const Review = require("../models/review");

// FOR POST REVIEW ROUTE
module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id; //author of the review

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    console.log("New Review Saved");
    req.flash("success", "New Review Added!");
    res.redirect(`/listings/${listing._id}`);
};


// FOR DELETE REVIEW ROUTE
module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // pull is a mongo operator, removes from an existing array all instances of a value or values that match a specified condition
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};