require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const Customer = require("./api/models/customer");
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

        // check if user already exist
        // Validate if user exist in our database
        const oldUser = await Customer.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database
        const customer = await create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // Create token
        const token = jwt.sign({ cust_id: cust._id, email },
            process.env.TOKEN_KEY, {
                expiresIn: "2h",
            }
        );
        // save user token
        user.token = token;

        //generate account number
        const response = await create({
            account_number: "1234567890",
        });

        // return new user
        res.status(201).json(response);
    } catch (err) {
        console.log(err);
    }

});

module.exports = app;