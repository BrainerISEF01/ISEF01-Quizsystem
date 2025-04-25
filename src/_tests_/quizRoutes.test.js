const request = require("supertest");
const express = require("express");
const { Question, Leaderboard } = require("../models");
const createQuizRoutes = require("../routes/quizRoutes");

// Mock DB
jest.mock("../models", () => ({
  Question: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  },
  Leaderboard: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
}));

describe("Quiz Routes", () => {
  let app;
  let ioMock;

  beforeEach(() => {
    ioMock = { to: jest.fn().mockReturnThis(), emit: jest.fn() };

    app = express();
    app.use(express.json());
    app.use("/quiz", createQuizRoutes(ioMock));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ----------------------------------------
  describe("POST /quiz/start", () => {
    it("sollte ein Quiz starten und Fragen zurückgeben", async () => {
      const mockQuestions = [
        { id: 1, question: "Frage A", correctAnswer: "A" },
        { id: 2, question: "Frage B", correctAnswer: "B" },
      ];
      Question.findAll.mockResolvedValue(mockQuestions);

      const res = await request(app).post("/quiz/start").send({
        mode: "1v1",
        user_id: "user123",
        opponent_id: "user456",
        timerDuration: "60",
      });

      expect(res.status).toBe(200);
      expect(res.body.questions).toEqual(mockQuestions);
      expect(res.body.msg).toBe("Quiz gestartet");
    });

    it("sollte einen Fehler zurückgeben bei ungültiger Timerdauer", async () => {
      const res = await request(app).post("/quiz/start").send({
        mode: "1v1",
        user_id: "user123",
        timerDuration: "abc",
      });

      expect(res.status).toBe(400);
      expect(res.body.msg).toBe("Ungültige Timer Dauer");
    });

    it("sollte 500 zurückgeben, wenn ein DB-Fehler auftritt", async () => {
      Question.findAll.mockRejectedValue(new Error("DB error"));

      const res = await request(app).post("/quiz/start").send({
        mode: "1v1",
        user_id: "user123",
        timerDuration: "60",
      });

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Fehler beim Starten des Quiz");
    });
  });

  // ----------------------------------------
  describe("POST /quiz/submit", () => {
    it("sollte eine richtige Antwort verarbeiten", async () => {
      const quizId = "quiz_123";
      const mockQuestion = {
        id: 1,
        question: "Hauptstadt von Frankreich?",
        correctAnswer: "Paris",
        options: ["Paris", "Berlin", "Rom"],
      };

      Question.findByPk.mockResolvedValue(mockQuestion);

      Leaderboard.create.mockResolvedValue({});

      Leaderboard.findAll.mockResolvedValue([
        {
          question_id: 1,
          score: 10,
          question: mockQuestion,
        },
      ]);

      const res = await request(app).post("/quiz/submit").send({
        quizId,
        questionId: 1,
        answer: "Paris",
        userId: "user1",
      });

      expect(res.status).toBe(200);
      expect(res.body.score).toBe(10);
      expect(res.body.correctCount).toBe(1);
      expect(res.body.result[0].isCorrect).toBe(true);
    });

    it("sollte einen Fehler liefern, wenn Frage nicht gefunden wird", async () => {
      Question.findByPk.mockResolvedValue(null);

      const res = await request(app).post("/quiz/submit").send({
        quizId: "quiz_456",
        questionId: 99,
        answer: "Berlin",
        userId: "user1",
      });

      expect(res.status).toBe(404);
      expect(res.body.msg).toBe("Frage nicht gefunden");
    });

    it("sollte einen Fehler liefern bei unerwartetem Fehler", async () => {
      Question.findByPk.mockRejectedValue(new Error("Unexpected error"));

      const res = await request(app).post("/quiz/submit").send({
        quizId: "quiz_789",
        questionId: 1,
        answer: "Paris",
        userId: "user1",
      });

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Fehler beim Absenden der Antwort");
    });
  });

  // ----------------------------------------
  describe("GET /quiz/league", () => {
    it("sollte Top 10 Spieler zurückgeben", async () => {
      const mockLeaderboard = [
        { user_id: "user1", score: 100 },
        { user_id: "user2", score: 90 },
      ];

      Leaderboard.findAll.mockResolvedValue(mockLeaderboard);

      const res = await request(app).get("/quiz/league");

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockLeaderboard);
      expect(ioMock.emit).toHaveBeenCalledWith("updateLeague", mockLeaderboard);
    });

    it("sollte einen Fehler beim Abrufen der Liga behandeln", async () => {
      Leaderboard.findAll.mockRejectedValue(new Error("DB Fehler"));

      const res = await request(app).get("/quiz/league");

      expect(res.status).toBe(500);
      expect(res.body.msg).toBe("Fehler beim Abrufen des Ligamodus");
    });
  });
});
