const mongoose = require("mongoose");

var accountNumberSchema = new mongoose.Schema({
    customerId: {
        type: String,
    },
    accountNumber: {
        type: String,
    },
    balance: {
        type: Number,
        default: 500000,
    },
    dateCreated: {
        type: Date,
        default: Date.Now,
    },
});
module.exports = mongoose.model("accountNumbers", accountNumberSchema);