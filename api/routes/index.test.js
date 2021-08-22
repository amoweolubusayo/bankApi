const mongoose = require("mongoose");
const { interactions, errors } = require("../controllers/fileController");
const request = require('supertest')
const app = require("./index");



describe("find all get routes", () => {
    beforeAll(async() => {
        console.log("Test Starting...");
        await mongoose.connection.dropDatabase();
    });

    afterAll(async() => {
        console.log("... Test Ended");
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
    it("should find all routes", async() => {
        await request(app)
            .get("/")
            .set("Accept", "application/json")
            .expect(200);
        await request(app)
            .get("/interactions", interactions)
            .set("Accept", "application/json")
            .expect(200);
        await request(app)
            .get("/errors", errors)
            .set("Accept", "application/json")
            .expect(200);
    });
});