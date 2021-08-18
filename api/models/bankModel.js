"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var CustomerProfileSchema = new Schema({
    firstName: {
        type: String,
        required: [true, "Kindly enter your first name"],
    },
    lastName: {
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
        default: DateTime.Now,
    },
});
module.exports = mongoose.model("CustomerProfile", CustomerProfileSchema);

var AccountNumberSchema = new Schema({
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
        default: DateTime.Now,
    },
});
module.exports = mongoose.model("AccountNumbers", AccountNumberSchema);

var TransactionHistoryLogSchema = new Schema({
    senderAccountNumber: {
        type: String,
        required: 'Sender"s Account Number cannot be empty',
    },
    receiverAccountNumber: {
        type: String,
        required: 'Receiver"s Account Number cannot be empty',
    },
    narration: {
        type: String,
    },
    amount: {
        type: Number,
        required: "Kindly enter your email",
    },
    transactionTime: {
        type: Date,
    },
    isSuccessful: {
        type: Boolean,
        default: false,
    },
    failureReason: {
        type: String,
    },
    reversalStatus: {
        type: Boolean,
    },
    trialCount: {
        type: Number,
    },
});
module.exports = mongoose.model(
    "TransactionHistoryLog",
    TransactionHistoryLogSchema
);

var AccountHistorySchema = new Schema({
    accountNumber: {
        type: String,
    },
    transactionType: {
        type: [{
            type: String,
            enum: ["debit", "credit", "unknown"],
        }, ],
        default: ["unknown"],
    },
    amount: {
        type: Number,
        required: "Kindly enter your email",
    },
    transactionTime: {
        type: Date,
    },
});
module.exports = mongoose.model("AccountHistory", AccountHistorySchema);