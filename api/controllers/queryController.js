const AccountNumber = require("../models/accountnumber");
const TransactionHistoryLog = require("../models/transactionhistorylog");

const findaccount = async(req, res) => {
    const { account_number } = req.params;
    if (!account_number) {
        return res.status(400).json({
            message: "Account number cannot be empty",
            data: null,
        });
    }
    if (account_number.length != 10) {
        return res.status(400).json({
            message: "Account number must be a 10-digit number",
            data: null,
        });
    }
    const accountDetails = await AccountNumber.findOne({
        account_number,
    }).populate("customer");
    console.log(accountDetails);
    if (!accountDetails) {
        return res.status(400).json({
            message: "Account number does not exist",
            data: null,
        });
    }
    const { first_name, last_name } = accountDetails.customer;
    // return accountdetails
    res.status(200).json({
        message: "Fetched successfully",
        data: {
            name: `${first_name} ${last_name}`,
        },
    });
}

const gettransaction = async(req, res) => {
    try {
        const { account_number, transactionType } = req.params;
        if (!account_number) {
            return res.status(400).json({
                message: "Account number cannot be empty",
                data: null,
            });
        }
        if (account_number.length != 10) {
            return res.status(400).json({
                message: "Account number must be a 10-digit number",
                data: null,
            });
        }
        const accountDetails = await AccountNumber.findOne({
            account_number,
        }).populate("customer");
        //console.log(accountDetails);
        if (!accountDetails) {
            return res.status(400).json({
                message: "Account number does not exist",
                data: null,
            });
        }

        if (transactionType == "debit") {
            const transDetails = await TransactionHistoryLog.find({
                sender_account_number: account_number,
            });
            // return transactiondDetails
            return res.status(200).json({
                message: "Fetched successfully",
                data: transDetails,
            });
        }
        if (transactionType == "credit") {
            const transDetails = await TransactionHistoryLog.find({
                receiver_account_number: account_number,
            });
            // return transactiondDetails
            res.status(200).json({
                message: "Fetched successfully",
                data: transDetails,
            });
        }
    } catch (err) {
        //use account number to fetch customer id
        console.log(err);
    }
}
module.exports = { findaccount, gettransaction };