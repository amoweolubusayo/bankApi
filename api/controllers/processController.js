const AccountNumber = require("../models/accountnumber");
const TransactionHistoryLog = require("../models/transactionhistorylog");
const sendfund = async(req, res) => {
    try {
        const {
            sender_account_number,
            receiver_account_number,
            narration,
            amount,
            transactionTime,
            isSuccessful,
            failure_reason,
            reversal_status,
            trial_count,
        } = req.body;
        // Validate input
        if (!(sender_account_number && receiver_account_number && amount)) {
            res.status(400).json({
                message: "All inputs are required",
                data: null,
            });
        }
        const senderAccountDetails = await AccountNumber.findOne({
            account_number: sender_account_number,
        }).populate("customer");
        if (!senderAccountDetails) {
            return res.status(400).json({
                message: "Sender's account number is invalid",
                data: null,
            });
        }
        const receiverAccountDetails = await AccountNumber.findOne({
            account_number: receiver_account_number,
        }).populate("customer");
        if (!receiverAccountDetails) {
            return res.status(400).json({
                message: "Receiver's account number is invalid",
                data: null,
            });
        }

        if (senderAccountDetails.balance < amount) {
            return res.status(400).json({
                message: "Insufficient Funds",
                data: null,
            });
        }
        senderAccountDetails.balance -= amount;
        receiverAccountDetails.balance += amount;
        await senderAccountDetails.save();
        await receiverAccountDetails.save();

        // populate transaction log table
        const transaction = await TransactionHistoryLog.create({
            sender_account_number,
            receiver_account_number,
            narration,
            amount,
            sender: senderAccountDetails.customer._id,
            receiver: receiverAccountDetails.customer._id,
            transactionTime: Date.now(),
            isSuccessful: true,
            failure_reason: "no error",
            reversal_status: false,
            trial_count: 0,
        });
        await transaction.save();
        res.status(200).json({
            message: "Funds transfered",
            data: null,
        });
    } catch (err) {
        console.log(err);
    }
};

const addaccountnumber = async(req, res) => {
    const userId = req.user.customer_id;
    const accountarr = await AccountNumber.find({
        customer: userId, //get user details from auth token
    });
    if (accountarr.length == 4) {
        return res.status(400).json({
            message: "Customer already has up to 4 account numbers",
            data: null,
        });
    }
    //generate account number
    const account = await AccountNumber.create({
        customer: userId,
        account_number: `${Date.now()}`.slice(0, 10),
    });
    await account.save();
    res.status(200).json({
        message: "Account number generated successfully",
        data: account,
    });
}

module.exports = { sendfund, addaccountnumber };