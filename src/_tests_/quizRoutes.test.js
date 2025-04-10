const request = require("supertest");
const express = require("express");
const { Question, Leaderboard } = require("../models");
const createQuizRoutes = require("../routes/quizRoutes");

// Mock the database models
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

describe("Quiz Routes Tests", () => {
    let app;
    let ioMock;

    beforeEach(() => {
        // Mock WebSocket (io) with .to().emit() chain
        ioMock = { to: jest.fn().mockReturnThis(), emit: jest.fn() };

        // Create a fresh Express app with the mocked routes
        app = express();
        app.use(express.json());
        app.use("/quiz", createQuizRoutes(ioMock));
    });

    afterEach(() => {
        // Reset all mocks after each test
        jest.clearAllMocks();
    });

    /** TEST 1: Start quiz */
    it("should start a quiz and return questions", async () => {
        const mockQuestions = [
            { id: 1, question: "What is the capital of France?", correctAnswer: "Paris" },
            { id: 2, question: "What is the capital of Germany?", correctAnswer: "Berlin" },
        ];

        Question.findAll.mockResolvedValue(mockQuestions);

        const response = await request(app).post("/quiz/start").send({
            mode: "1v1",
            user_id: "user1",
            timerDuration: 60,
        });

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Quiz gestartet");
        expect(response.body.questions).toEqual(mockQuestions);
    });

    /** TEST 2: Error starting a quiz */
    it("should return error if quiz start fails", async () => {
        Question.findAll.mockRejectedValue(new Error("DB error"));

        const response = await request(app).post("/quiz/start").send({
            mode: "1v1",
            user_id: "user1",
            timerDuration: 60,
        });

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Starten des Quiz");
    });

    /** TEST 3: Submit a correct answer */
    it("should process a correct answer and return points", async () => {
        const mockQuestion = {
            id: 1,
            question: "What is the capital of France?",
            correctAnswer: "Paris",
        };

        Question.findByPk.mockResolvedValue(mockQuestion);

        const response = await request(app).post("/quiz/submit").send({
            quizId: "quiz_123",
            questionId: 1,
            answer: "Paris",
            userId: "user1",
        });

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Richtig!");
        expect(response.body.points).toBe(10);

        expect(Leaderboard.create).toHaveBeenCalledWith({
            user_id: "user1",
            quiz_id: "quiz_123",
            score: 10,
        });
    });

    /** TEST 4: Question not found */
    it("should return 404 if question is not found", async () => {
        Question.findByPk.mockResolvedValue(null);

        const response = await request(app).post("/quiz/submit").send({
            quizId: "quiz_123",
            questionId: 1,
            answer: "Paris",
            userId: "user1",
        });

        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Frage nicht gefunden");
    });

    /** TEST 5: Get top 10 players (league mode) */
    it("should retrieve top 10 players for league mode", async () => {
        const mockScores = [
            { user_id: "user1", score: 100 },
            { user_id: "user2", score: 90 },
        ];

        Leaderboard.findAll.mockResolvedValue(mockScores);

        const response = await request(app).get("/quiz/league");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockScores);
    });

    /** TEST 6: Error retrieving league mode */
    it("should return error if league mode query fails", async () => {
        Leaderboard.findAll.mockRejectedValue(new Error("DB error"));

        const response = await request(app).get("/quiz/league");

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Abrufen des Ligamodus");
    });
});
