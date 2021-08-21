require("dotenv").config();
require("../../config/database").connect();
const express = require("express");
const auth = require("../../middleware/auth");
const { signup, login } = require("../controllers/authController");
const { sendfund, addaccountnumber } = require("../controllers/processController");
const { findaccount, gettransaction } = require("../controllers/queryController");
const { interactions, errors } = require("../controllers/fileController");
const app = express();
app.use(express.json({ limit: "50mb" }));


app.post("/signup", signup);
app.post("/login", login);
app.post("/sendfund", auth, sendfund);
app.post("/addaccountnumber", auth, addaccountnumber);
app.get("/findaccount/:account_number", auth, findaccount);
app.get("/getTransaction/:account_number/:transactionType", auth, gettransaction);
app.get("/interactions", interactions);
app.get("/errors", errors);


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

module.exports = app;