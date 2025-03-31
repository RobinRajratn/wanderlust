// ROUTES FOR LISTINGS (kis path pe request aa rahi hai)

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controllers/listings.js"); // function associated with each route

// HANDLING multipart/form-data and IMAGE UPLOADATION
const multer = require('multer'); // handling multipart/form-data, which is primarily used for uploading files
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // multer by default uploads to cloudinary storage 

// CHAINING ALL THE REQUESTS OF THE SAME PATH
// we are writing all the req of "/" path together
router.route("/")
    .get(wrapAsync(listingController.index)) //Index Route
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing)); //Create Route (add the new listing)



// NEW ROUTE (form to add a new listing)
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm)); // using wrapAsync to handle errors
// we will keep new route before otherwise router will new logic like id



// we are writing all the req of "/:id" path together
router.route("/:id")
    .get(wrapAsync(listingController.showListing)) // Show Route (print data of an individual listing)
    .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) // Update Route (to update the details of the listing)
    .delete(isOwner, isLoggedIn, wrapAsync(listingController.destroyListing)); // Delete Route



// EDIT ROUTE (open form to edit the details)
router.get("/:id/edit", isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;