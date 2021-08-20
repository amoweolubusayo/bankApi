const mongoose = require("mongoose");
const { Schema } = mongoose

var customerProfileSchema = new Schema({
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
    date_created: {
        type: Date,
        default: Date.Now,
    },
});
module.exports = mongoose.model("Customer", customerProfileSchema);