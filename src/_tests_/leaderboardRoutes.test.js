const request = require("supertest");
const app = require("../app");
const { Leaderboard, GameData } = require("../models");

// Mock models including sequelize query
jest.mock("../models", () => ({
    Leaderboard: {
        findAll: jest.fn(),
    },
    GameData: {
        sequelize: {
            query: jest.fn(),
            QueryTypes: {
                SELECT: "SELECT",
            },
        },
    },
}));

describe("Leaderboard Routes Tests", () => {
    afterEach(() => {
        // Reset all mocks after each test
        jest.clearAllMocks();
    });

    /** TEST 1: Retrieve leaderboard successfully */
    it("should fetch the leaderboard successfully", async () => {
        const mockScores = [
            { id: 1, userId: "user1", score: 100 },
            { id: 2, userId: "user2", score: 90 },
        ];

        Leaderboard.findAll.mockResolvedValue(mockScores);

        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockScores);
    });

    /** TEST 2: Handle leaderboard DB error */
    it("should return an error if leaderboard query fails", async () => {
        Leaderboard.findAll.mockRejectedValue(new Error("DB error"));

        const response = await request(app).get("/");

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Abrufen des Leaderboards");
    });

    /** TEST 3: Retrieve combined game results from gamedata */
    it("should fetch combined game results from GameData", async () => {
        const mockResults = [
            { MODE: "classic", USER: "user1@test.de", score: 80 },
            { MODE: "classic", USER: "user2@test.de", score: 70 },
        ];

        GameData.sequelize.query.mockResolvedValue(mockResults);

        const response = await request(app).get("/result");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockResults);
        expect(GameData.sequelize.query).toHaveBeenCalledWith(
            expect.stringContaining("SELECT MODE"),
            { type: "SELECT" }
        );
    });

    /** TEST 4: Handle /result query error */
    it("should return an error if GameData query fails", async () => {
        GameData.sequelize.query.mockRejectedValue(new Error("Query failed"));

        const response = await request(app).get("/result");

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Abrufen der Ergebnisse");
    });
});
