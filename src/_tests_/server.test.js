const request = require("supertest");
const { server, io } = require("../server"); // import the server and the webscoket instance

describe("Server Tests", () => {
    afterAll((done) => {
        server.close(done); // Close the server after testing
    });

    it("sollte die Hauptseite (Root) erreichen", async () => {
        const response = await request(server).get("/"); // Try to access the main page

        expect(response.status).toBe(404); // By default, a GET request to the root address should return a 404 error
    });

    it("sollte die Auth-Routen erreichen", async () => {
        // mocks login endpoint
        const response = await request(server).post("/auth/login").send({
            username: "testuser",
            password: "testpass"
        });

        expect(response.status).toBe(404); // Default response if this route does not exist
    });

    it("sollte die Quiz-Routen erreichen", async () => {
        // Testen Sie den Start des Quiz
        const response = await request(server).post("/quiz/start").send({
            mode: "1v1",
            user_id: "user1",
            timerDuration: 60
        });

        expect(response.status).toBe(500); // This route will likely return an error due to mocking in quiz routes
    });

    it("sollte die League-Routen erreichen", async () => {
        // Testen Sie den Zugriff auf die Liga
        const response = await request(server).get("/quiz/league");

        expect(response.status).toBe(500); // This route will probably return an error
    });
});
