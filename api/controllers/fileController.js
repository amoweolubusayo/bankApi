const fs = require("fs");
const interactions = (req, res) => {
    fs.stat("interactions.txt", (err, stats) => {
        const readable = fs.createReadStream("interactions.txt");
        let chunk = [];
        var interactions = new String();
        readable.on("data", (chunk) => {
            interactions += chunk;
        });

        readable.on("end", () => {
            res.send(interactions);
        });
    });
}

const errors = (req, res) => {
    fs.stat("errors.txt", (err, stats) => {
        const readable = fs.createReadStream("errors.txt");
        let chunk = [];
        var errors = new String();
        readable.on("data", (chunk) => {
            errors += chunk;
        });

        readable.on("end", () => {
            res.send(errors);
        });
    });
}

module.exports = { interactions, errors };