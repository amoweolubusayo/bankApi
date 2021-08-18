const mongoose = require("mongoose");

var customerProfileSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Kindly enter your first name"],
    },
    last_name: {
        type: String,
        required: [true, "Kindly enter your last name"],
    },
    email: {
        type: String,
        required: [true, "Kindly enter your email"],
    },
    password: {
        type: String,
        required: [true, "Kindly enter your password"],
    },
    dateCreated: {
        type: Date,
        default: Date.Now,
    },
});
module.exports = mongoose.model("customer", customerProfileSchema);