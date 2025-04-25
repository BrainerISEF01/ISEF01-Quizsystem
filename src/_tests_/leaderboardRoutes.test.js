const request = require("supertest");
const express = require("express");
const leaderboardRoutes = require("../routes/leaderboardRoutes");
const { Leaderboard, GameData } = require("../models");

// Setup Express app with the tested routes
const app = express();
app.use(express.json());
app.use("/", leaderboardRoutes);

// Mocks
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

beforeEach(() => {
  jest.clearAllMocks();
});

// ============================================
// TESTS: GET / (Leaderboard with Question)
// ============================================
describe("GET / (Leaderboard)", () => {
  it("sollte die Leaderboard-Daten erfolgreich abrufen", async () => {
    const mockScores = [
      {
        id: 1,
        userId: "user1",
        score: 100,
        question: { id: 10, text: "Frage 1" },
      },
      {
        id: 2,
        userId: "user2",
        score: 90,
        question: { id: 11, text: "Frage 2" },
      },
    ];

    Leaderboard.findAll.mockResolvedValue(mockScores);

    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockScores);
    expect(Leaderboard.findAll).toHaveBeenCalledWith({
      include: [{ model: expect.anything(), as: "question" }],
      order: [["score", "DESC"]],
    });
  });

  it("sollte einen Fehler zurückgeben, wenn findAll fehlschlägt", async () => {
    Leaderboard.findAll.mockRejectedValue(new Error("DB Fehler"));

    const response = await request(app).get("/");

    expect(response.status).toBe(500);
    expect(response.body.msg).toBe("Fehler beim Abrufen des Leaderboards");
  });
});

// ============================================
// TESTS: GET /result (GameData UNION Query)
// ============================================
describe("GET /result (Spielergebnisse)", () => {
  it("sollte Spielergebnisse korrekt abrufen", async () => {
    const mockResults = [
      { MODE: "classic", USER: "player1@example.com", score: 75 },
      { MODE: "classic", USER: "player2@example.com", score: 60 },
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

  it("sollte einen Fehler zurückgeben, wenn die SQL-Query fehlschlägt", async () => {
    GameData.sequelize.query.mockRejectedValue(new Error("SQL Fehler"));

    const response = await request(app).get("/result");

    expect(response.status).toBe(500);
    expect(response.body.msg).toBe("Fehler beim Abrufen der Ergebnisse");
  });
});
