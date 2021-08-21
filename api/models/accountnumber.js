const mongoose = require("mongoose");
const { Schema } = mongoose

var accountNumberSchema = new Schema({
    customer: {
        type: Schema.ObjectId,
        ref: "Customer",
    },
    account_number: {
        type: Number,
        required: true
    },
    balance: {
        type: Number,
        default: 5000,
    },
    dateCreated: {
        type: Date,
        default: Date.Now,
    },
});
module.exports = mongoose.model("AccountNumbers", accountNumberSchema);