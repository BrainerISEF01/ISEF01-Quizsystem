const request = require("supertest");
const app = require("../app"); 
const { Question } = require("../models"); 

// Active Mocks
jest.mock("../models", () => ({
    Question: {
        create: jest.fn(),
        bulkCreate: jest.fn(),
    },
}));

describe("Questions Routes Tests", () => {
    afterEach(() => {
        jest.clearAllMocks(); // Reset Mocks after every start
    });

    /** TEST 1: Add a single question */
    it("sollte eine einzelne Frage hinzufügen", async () => {
        const mockQuestion = {
            question: "Was ist die Hauptstadt von Frankreich?",
            options: ["Berlin", "Madrid", "Paris"],
            correctAnswer: "Paris",
            created_by: "user1",
        };

        // Mock the create method to return the test data
        Question.create.mockResolvedValue(mockQuestion);

        const response = await request(app)
            .post("/add") // POST Request to the /add endpoint
            .send(mockQuestion);

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe("Frage hinzugefügt");
        expect(response.body.newQuestion).toEqual(mockQuestion); // check if the answer correspond to the expected data
    });

    /** TEST 2: error adding a question */
    it("sollte einen Fehler zurückgeben, wenn beim Hinzufügen einer Frage ein Fehler auftritt", async () => {
        // Mock the create method to return the error
        Question.create.mockRejectedValue(new Error("DB Fehler"));

        const response = await request(app)
            .post("/add")
            .send({
                question: "Was ist die Hauptstadt von Frankreich?",
                options: ["Berlin", "Madrid", "Paris"],
                correctAnswer: "Paris",
                created_by: "user1",
            });

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Hinzufügen der Frage"); // check if the error massage is correct
    });

    /** TEST 3: add multiple questions */
    it("sollte mehrere Fragen hinzufügen", async () => {
        const mockQuestions = [
            {
                question: "Was ist die Hauptstadt von Deutschland?",
                options: ["Berlin", "Madrid", "Paris"],
                correctAnswer: "Berlin",
                created_by: "user1",
            },
            {
                question: "Was ist die Hauptstadt von Spanien?",
                options: ["Berlin", "Madrid", "Paris"],
                correctAnswer: "Madrid",
                created_by: "user2",
            },
        ];

        // Mock the bulkCreate method
        Question.bulkCreate.mockResolvedValue(mockQuestions);

        const response = await request(app)
            .post("/addMultiple") 
            .send({ questions: mockQuestions });

        expect(response.status).toBe(200);
        expect(response.body.msg).toBe(`${mockQuestions.length} Fragen hinzugefügt`); // check if the answer correspond to the expected data
    });

    /** TEST 4: error adding multiple questions */
    it("sollte einen Fehler zurückgeben, wenn beim Hinzufügen mehrerer Fragen ein Fehler auftritt", async () => {
        // Mock the bulkCreate method to return a error
        Question.bulkCreate.mockRejectedValue(new Error("DB Fehler"));

        const response = await request(app)
            .post("/addMultiple")
            .send({ questions: [] }); // Send an empty list or other test data

        expect(response.status).toBe(500);
        expect(response.body.msg).toBe("Fehler beim Speichern der Fragen"); // Check if the error message is correct
    });
});
