const request = require("supertest");
const app = require("../app");
const { Question, GameData } = require("../models");
const { activeGames } = require("../routes/gameRoutes");

// Mock models
jest.mock("../models", () => ({
  Question: {
    findAll: jest.fn(),
  },
  GameData: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
  },
}));

describe("Game Routes Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clear all active games after each test
    Object.keys(activeGames).forEach(game => delete activeGames[game]);
  });

  /** TEST 1: Create new game if no open game exists */
  it("should create a new game if no open game is available", async () => {
    Question.findAll.mockResolvedValue([
      { id: 1, question: "Question 1", options: ["A", "B", "C"], correctAnswer: "A" },
      { id: 2, question: "Question 2", options: ["X", "Y", "Z"], correctAnswer: "Y" },
    ]);

    const response = await request(app)
      .post("/matchmaking")
      .send({ userId: "user1", timerDuration: 120 });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe("Warte auf Gegner...");
    expect(response.body).toHaveProperty("gameId");
  });

  /** TEST 2: Join an existing open game */
  it("should join an existing game if one player is waiting", async () => {
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

  /** TEST 3: Handle matchmaking database error */
  it("should return an error if the database fails", async () => {
    Question.findAll.mockRejectedValue(new Error("DB error"));

    const response = await request(app)
      .post("/matchmaking")
      .send({ userId: "user1", timerDuration: 120 });

    expect(response.status).toBe(500);
    expect(response.body.msg).toBe("Fehler beim Matchmaking");
  });

  /** TEST 4: Create a new game data entry */
  it("should create a new GameData entry", async () => {
    GameData.findOne.mockResolvedValue(null);
    GameData.create.mockResolvedValue({ id: 1 });

    const response = await request(app)
      .post("/create")
      .send({
        gameId: "game_test",
        userId: "u1",
        userEmail: "u1@test.de",
        mode: "classic",
        timerDuration: 90,
        opponentId: null,
        opponentEmail: null,
        status: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe("game_test created");
  });

  /** TEST 5: Fetch list of open games */
  it("should return a list of games with status 1", async () => {
    GameData.findAll.mockResolvedValue([{ gameId: "game1" }, { gameId: "game2" }]);

    const response = await request(app)
      .get("/list");

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  /** TEST 6: Update opponent information */
  it("should update opponent data in a game", async () => {
    const fakeGame = { save: jest.fn(), opponentId: null, opponentEmail: null };
    GameData.findOne
      .mockResolvedValueOnce(fakeGame) // First call for finding game
      .mockResolvedValueOnce({ gameId: "game123", opponentId: "op1", opponentEmail: "op@test.de" }); // Second call for updated game

    const response = await request(app)
      .post("/update-op")
      .send({
        gameId: "game123",
        opponentId: "op1",
        opponentEmail: "op@test.de"
      });

    expect(response.status).toBe(200);
    expect(response.body.msg).toContain("updated");
    expect(response.body.updatedGame.opponentId).toBe("op1");
  });

  /** TEST 7: Get game data by ID */
  it("should return game data for a given gameId", async () => {
    GameData.findOne.mockResolvedValue({ gameId: "gameEnde" });

    const response = await request(app)
      .post("/ende")
      .send({ gameId: "gameEnde" });

    expect(response.status).toBe(200);
    expect(response.body.gameId).toBe("gameEnde");
  });

  /** TEST 8: Update game status */
  it("should update the status of a game", async () => {
    const fakeGame = { save: jest.fn(), gameId: "gameStatus", status: 1 };
    GameData.findOne.mockResolvedValue(fakeGame);

    const response = await request(app)
      .post("/updateStatus")
      .send({ gameId: "gameStatus", status: 2 });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe("Game ID gameStatus end");
  });
});
