const request = require("supertest");
const app = require("../app"); 
const { Question } = require("../models"); 
const { activeGames } = require("../routes/gameRoutes"); 

// Active Mocks
jest.mock("../models", () => ({
  Question: {
    findAll: jest.fn(),
  },
}));

describe("Game-Routes Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Reset Mocks 
  });

  afterEach(() => {
    // Empty ActiveGames after each test
    Object.keys(activeGames).forEach(game => delete activeGames[game]);
  });

  /** TEST 1: create new game */
  it("sollte ein neues Spiel erstellen, wenn kein offenes Spiel existiert", async () => {
    Question.findAll.mockResolvedValue([
      { id: 1, question: "Frage 1", options: ["A", "B", "C"], correctAnswer: "A" },
      { id: 2, question: "Frage 2", options: ["X", "Y", "Z"], correctAnswer: "Y" },
    ]);

    const response = await request(app)
      .post("/matchmaking")
      .send({ userId: "user1", timerDuration: 120 });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe("Warte auf Gegner...");
    expect(response.body).toHaveProperty("gameId");

    const gameId = response.body.gameId;
    expect(activeGames[gameId]).toBeDefined();
    expect(activeGames[gameId].players).toContain("user1");
  });

  /** TEST 2: Player joins an open game */
  it("sollte einem existierenden Spiel beitreten, wenn bereits ein Spieler wartet", async () => {
    const existingGameId = "game_123";
    activeGames[existingGameId] = {
      players: ["user1"],
      questions: [],
      currentQuestionIndex: 0,
      scores: { user1: 0 },
      timer: 120,
    };

    const response = await request(app)
      .post("/matchmaking") 
      .send({ userId: "user2", timerDuration: 120 });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe("Spiel gefunden!");
    expect(response.body.gameId).toBe(existingGameId);
    expect(activeGames[existingGameId].players).toContain("user2");
  });

  /** TEST 3: Matchmaking error */
  it("sollte einen Fehler zurückgeben, wenn die Datenbank einen Fehler hat", async () => {
    Question.findAll.mockRejectedValue(new Error("DB Fehler"));

    const response = await request(app)
      .post("/matchmaking") 
      .send({ userId: "user1", timerDuration: 120 });

    expect(response.status).toBe(500);
    expect(response.body.msg).toBe("Fehler beim Matchmaking");
  });
});
