const request = require("supertest");
const app = require("../app");
const { Leaderboard } = require("../models"); 

// Active Mocks
jest.mock("../models", () => ({
    Leaderboard: {
        findAll: jest.fn(),
    },
}));

describe("Leaderboard Routes Tests", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset Mocks nach jedem Test
    });

    /** TEST 1: Get leaderboard */
    it("sollte das Leaderboard abrufen", async () => {
        const mockScores = [
            { id: 1, userId: "user1", score: 100 },
            { id: 2, userId: "user2", score: 90 },
        ];

        // Mock the findAll method to return the test data
        Leaderboard.findAll.mockResolvedValue(mockScores);

        const response = await request(app).get("/"); // GET Request to the Leaderboard endpoint

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockScores); // check if the answer correspond to the expexted data
    });

    /** TEST 2: Error retrieving leaderboard */
    it("sollte einen Fehler zurückgeben, wenn ein Fehler bei der Datenbankabfrage auftritt", async () => {
        // Mock the findAll method to return an error
        Leaderboard.findAll.mockRejectedValue(new Error("DB Fehler"));

        const response = await request(app).get("/"); // GET Request to the Leaderboard endpoint

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Abrufen des Leaderboards"); // check if the fehlermeldung ist correct
    });
});
