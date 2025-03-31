// WHAT WORK TO DO WHEN REQ COMES TO LISTINGS

const Listing = require("../models/listing");

// SETTING API FOR GEOCODING
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// FOR INDEX ROUTE
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};


// FOR NEW ROUTE
module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};


// FOR SHOW ROUTE
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author", }, }).populate("owner"); // nested populate
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist :(");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};


// FOR CREATE ROUTE
module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({ // geocoding
        query: req.body.listing.location,
        limit: 1,
    }).send();

    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    // in the owner of the new listing, the id of current user is being saved
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry; // storing the coordinates of the location to DB
    await newListing.save();
    req.flash("success", "New Listing Added!");
    res.redirect("/listings");
};


// FOR EDIT ROUTE
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist :(");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250"); // decreasing quality of the image by using api of cloudinary

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};


// FOR UPDATE ROUTE
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); //deconstructing js object

    if (typeof req.file !== "undefined") { // if we uploaded no new img, no img will be coming in req
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


// FOR DELETE ROUTE
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};