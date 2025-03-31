// DATABASE SCHEMA FOR USERS
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    },
});

userSchema.plugin(passportLocalMongoose); // implement username, hashing, salting, hashed password automatically
// no need to build from scratch

module.exports = mongoose.model("User", userSchema);