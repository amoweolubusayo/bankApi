const mongoose = require("mongoose");

var transactionHistoryLogSchema = new mongoose.Schema({
    sender_account_number: {
        type: String,
        required: [true, 'Sender"s Account Number cannot be empty'],
    },
    receiver_account_number: {
        type: String,
        required: [true, 'Receiver"s Account Number cannot be empty'],
    },
    narration: {
        type: String,
    },
    amount: {
        type: Number,
        required: [true, 'Amount cannot be empty'],
    },
    transactionTime: {
        type: Date,
        default: Date.Now
    },
    isSuccessful: {
        type: Boolean,
        default: false,
    },
    failure_reason: {
        type: String,
    },
    reversal_status: {
        type: Boolean,
    },
    trial_count: {
        type: Number,
    },
});
module.exports = mongoose.model("transactionHistoryLog", transactionHistoryLogSchema);