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
            res.status(400).send("All input is required");
        }

        // check if user has 4 account numbers
        // Validate if user exist in our database
        const oldUser = await Customer.findById({ email });

        if (oldUser) {
            return res.status(409).send("You have up to four account numbers already");
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
        res.send(customer);

        //generate account number
        const acctresponse = await AccountNumber.create({
            account_number: Math.floor(100000 + Math.random() * 900000),
        });


        await acctresponse.save();
        res.send(acctresponse);

        // Create token
        const token = jwt.sign({ cust_id: cust._id, email },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;



        // return new user
        res.status(201).json(response);
    } catch (err) {
        console.log(err);
    }

});


app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

app.get("/findaccount", auth, async(req, res) => {
    const { accountNumber } = req.body;

    const accountDetails = await AccountNumber.findById({ accountNumber })
        // return accountdetails
    res.status(201).json(accountDetails);
});

app.post("/sendfund", auth, (req, res) => {
    const { sender_account_number, receiver_account_number, narration, amount } = req.body;
    // Validate input
    if (!(sender_account_number && receiver_account_number && amount)) {
        res.status(400).send("All input is required");
    }
    //use account number to fetch customer id
});



module.exports = app;