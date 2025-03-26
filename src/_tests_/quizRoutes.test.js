const request = require("supertest");
const express = require("express");
const { Question, Leaderboard } = require("../models"); 
const createQuizRoutes = require("../routes/quizRoutes"); // import the quiz routes

// Active Mocks
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
        ioMock = { to: jest.fn().mockReturnThis(), emit: jest.fn() }; // Mock for WebSocket instance
        app = express();
        app.use(express.json());
        app.use("/quiz", createQuizRoutes(ioMock)); // Insert quiz routes with the mock
    });

    afterEach(() => {
        jest.clearAllMocks(); // Reset Mocks after every test
    });

    /** TEST 1: start quiz */
    it("sollte ein Quiz starten", async () => {
        const mockQuestions = [
            { id: 1, question: "Was ist die Hauptstadt von Frankreich?", correctAnswer: "Paris" },
            { id: 2, question: "Was ist die Hauptstadt von Deutschland?", correctAnswer: "Berlin" },
        ];

        // Mock the findAll method to return the test questions
        Question.findAll.mockResolvedValue(mockQuestions);

        const response = await request(app)
            .post("/quiz/start")
            .send({
                mode: "1v1",
                user_id: "user1",
                timerDuration: 60,
            });

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Quiz gestartet");
        expect(response.body.questions).toEqual(mockQuestions); // Check that the questions correspond to the expected data
    });

    /** TEST 2: Error starting a quiz */
    it("sollte einen Fehler zurückgeben, wenn ein Fehler beim Starten des Quiz auftritt", async () => {
        // Simulate an error when retrieving the questions
        Question.findAll.mockRejectedValue(new Error("DB Fehler"));

        const response = await request(app)
            .post("/quiz/start")
            .send({
                mode: "1v1",
                user_id: "user1",
                timerDuration: 60,
            });

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Starten des Quiz"); // Check if the error message is correct
    });

    /** TEST 3: send answer  */
    it("sollte die Antwort eines Benutzers verarbeiten", async () => {
        const mockQuestion = { id: 1, question: "Was ist die Hauptstadt von Frankreich?", correctAnswer: "Paris" };
        Question.findByPk.mockResolvedValue(mockQuestion);

        const response = await request(app)
            .post("/quiz/submit")
            .send({
                quizId: "quiz_123",
                questionId: 1,
                answer: "Paris",
                userId: "user1",
            });

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Richtig!"); // chcek  if the answer is correct
        expect(response.body.points).toBe(10); // points for the correct answer

        expect(Leaderboard.create).toHaveBeenCalledWith({
            user_id: "user1",
            quiz_id: "quiz_123",
            score: 10,
        });
    });

    /** TEST 4: Error sending a reply */
    it("sollte einen Fehler zurückgeben, wenn die Frage nicht gefunden wird", async () => {
        Question.findByPk.mockResolvedValue(null); // Simulate that the question is not found

        const response = await request(app)
            .post("/quiz/submit")
            .send({
                quizId: "quiz_123",
                questionId: 1,
                answer: "Paris",
                userId: "user1",
            });

        expect(response.status).toBe(404);
        expect(response.body.msg).toBe("Frage nicht gefunden"); // Check if the error message is correct
    });

    /** TEST 5: access the league mode */
    it("sollte die Top 10 Spieler abrufen", async () => {
        const mockScores = [
            { user_id: "user1", score: 100 },
            { user_id: "user2", score: 90 },
        ];

        // Mock the findAll method to return the test data
        Leaderboard.findAll.mockResolvedValue(mockScores);

        const response = await request(app).get("/quiz/league");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockScores); // check if the answer correspond to the expected data ob
    });

    /** TEST 6: Error retrieving the league */
    it("sollte einen Fehler zurückgeben, wenn ein Fehler beim Abrufen der Liga auftritt", async () => {
        // Simulate an error when retrieving the league
        Leaderboard.findAll.mockRejectedValue(new Error("DB Fehler"));

        const response = await request(app).get("/quiz/league");

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Abrufen des Ligamodus"); // check, if the error massage is correct
    });
});
