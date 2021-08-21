const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");
const AccountNumber = require("../models/accountnumber");

const signup = async(req, res) => {
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
            return res.status(400).json({
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
            customer: customer._id,
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
                token,
            },
        });
    } catch (err) {
        console.log(err);
    }
}

const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).json({
                message: "All inputs are required",
                data: null,
            });
        }
        const customer = await Customer.findOne({ email });
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
                token,
            },
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = { signup, login };