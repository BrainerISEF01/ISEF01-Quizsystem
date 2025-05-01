const request = require("supertest");
const { server } = require("../server");
const { io } = require("socket.io-client");

afterAll((done) => {
    server.close(done); // Close server after all tests
});

describe("Server Routing Tests", () => {
    
    describe("🔍 Root Route", () => {
        it("sollte 404 zurückgeben, wenn '/' aufgerufen wird", async () => {
            const response = await request(server).get("/");
            expect(response.status).toBe(404); // no endpoint defines a route
        });
    });

    describe("Auth-Routen", () => {
        it("sollte 404 zurückgeben bei POST /auth/login (wenn nicht implementiert)", async () => {
            const response = await request(server)
                .post("/auth/login")
                .send({ username: "testuser", password: "testpass" });

            expect(response.status).toBe(404);
        });
    });

    describe("Quiz-Routen", () => {
        it("sollte 500 zurückgeben, wenn ein Quiz ohne vollständige Daten gestartet wird", async () => {
            const response = await request(server)
                .post("/quiz/start")
                .send({ mode: "1v1", user_id: "user1", timerDuration: 60 });

            expect(response.status).toBeGreaterThanOrEqual(400);
        });

        it("sollte 500 zurückgeben beim Zugriff auf /quiz/league ohne Setup", async () => {
            const response = await request(server).get("/quiz/league");
            expect(response.status).toBeGreaterThanOrEqual(400);
        });
    });

    describe(" Leaderboard-Routen", () => {
        it("sollte 404 zurückgeben bei GET /leaderboard (wenn nicht definiert)", async () => {
            const response = await request(server).get("/leaderboard");
            expect(response.status).toBe(404); // if no get is defined 
        });
    });

    describe("Fragen-Routen", () => {
        it("sollte 404 zurückgeben bei GET /questions (wenn Route fehlt)", async () => {
            const response = await request(server).get("/questions");
            expect(response.status).toBe(404);
        });
    });
});

describe("🧪 WebSocket Events", () => {
    let clientSocket;

    beforeAll((done) => {
        clientSocket = io("http://localhost:4000");
        clientSocket.on("connect", done);
    });

    afterAll(() => {
        if (clientSocket.connected) {
            clientSocket.disconnect();
        }
    });

    it("should receive 'gameCreatedOk' when 'gameCreated' is emitted", (done) => {
        const testData = { username: "tester", gameId: "game123" };

        // Listen for the server response
        clientSocket.on("gameCreatedOk", (data) => {
            try {
                // Assert the server response contains the correct fields
                expect(data).toHaveProperty("status", 1);
                expect(data).toHaveProperty("username", testData.username);
                expect(data).toHaveProperty("gameId", testData.gameId);
                done();
            } catch (error) {
                done(error); // fail the test
            }
        });

        // Emit the event
        clientSocket.emit("gameCreated", testData);
    });
});
