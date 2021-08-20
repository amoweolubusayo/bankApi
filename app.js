require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Customer = require("./api/models/customer");
const AccountNumber = require("./api/models/accountnumber");
const TransactionHistoryLog = require("./api/models/transactionhistorylog");
const auth = require("./middleware/auth");
const app = express();

app.use(express.json({ limit: "50mb" }));

// Sign up
app.post("/signup", async(req, res) => {
    try {
        // Get customer input
        const { first_name, last_name, email, password } = req.body;

        // Validate user input
        if (!(email && password && first_name && last_name)) {
            return res.status(400).json({
                message: "All inputs are required",
                data: null,
            });
        }

        // check if user has 4 account numbers
        // Validate if user exist in our database
        const oldCustomer = await Customer.findOne({ email });
        console.log(oldCustomer);
        if (oldCustomer) {
            return res.status(409).json({
                message: "Customer already exists",
                data: null,
            });
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const customer = await Customer.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        await customer.save();

        //generate account number
        const account = await AccountNumber.create({
            customerId: customer._id,
            account_number: `${Date.now()}`.slice(0, 10),
        });
        await account.save();

        // Generate token
        const token = jwt.sign({ customer_id: customer._id, email },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );

        // return new customer
        res.status(200).json({
            message: "Created successfully",
            data: {
                ...customer.toJSON(),
                token
            },
        });
    } catch (err) {
        console.log(err);
    }
});


//login
app.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({
                message: "All inputs are required",
                data: null,
            });
        }
        const customer = await Customer.findOne({ email })
        if (!customer || bcrypt.compareSync(customer.password, password)) {
            return res.status(400).json({
                message: "invalid email or password",
                data: null,
            });
        }
        // Generate token
        const token = jwt.sign({ customer_id: customer._id, email },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );
        res.status(200).json({
            message: "Login successful",
            data: {
                ...customer.toJSON(),
                token
            },
        });

    } catch (err) {
        console.log(err);
    }

});

app.get("/findaccount/:account_number", auth, async(req, res) => {
    const { account_number } = req.params;
    if (!account_number) {
        return res.status(400).json({
            message: "Account number cannot be empty",
            data: null
        });
    }
    if (account_number.length != 10) {
        return res.status(400).json({
            message: "Account number must be a 10-digit number",
            data: null
        });
    }
    const accountDetails = await AccountNumber.findOne({ account_number }).populate("customerId")
    console.log(accountDetails)
    if (!accountDetails) {
        return res.status(400).json({
            message: "Account number does not exist",
            data: null
        });
    }
    const { first_name, last_name } = accountDetails.customerId;
    // return accountdetails
    res.status(200).json({
        message: "Fetched successfully",
        data: {
            name: `${first_name} ${last_name}`
        }
    });
});

app.post("/sendfund", auth, async(req, res) => {
    try {
        const { sender_account_number, receiver_account_number, narration, amount } =
        req.body;
        // Validate input
        if (!(sender_account_number && receiver_account_number && amount)) {
            res.status(400).json({
                message: "All inputs are required",
                data: null
            });
        }
        const senderAccountDetails = await AccountNumber.findOne({ sender_account_number }).populate("customerId")
        if (!senderAccountDetails) {
            return res.status(400).json({
                message: "Sender's account number is invalid",
                data: null
            });
        }
        const receiverAccountDetails = await AccountNumber.find({ receiver_account_number }).populate("customerId");
        if (!receiverAccountDetails) {
            return res.status(400).json({
                message: "Receiver's account number is invalid",
                data: null
            });
        }

        if (senderAccountDetails.balance < amount) {
            res.status(400).json({
                message: "Insufficient Funds",
                data: null
            });
        }
        senderAccountDetails.balance -= amount;
        receiverAccountDetails.balance += amount;
        await senderAccountDetails.save();
        await receiverAccountDetails.save();
    }
    //use account number to fetch customer id
    catch (err) {
        console.log(err);
    }
});

module.exports = app;