const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Setup Express app
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

// Mocks
jest.mock("../models", () => ({
    User: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
    hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

// ===============================
// LOGIN TESTS
// ===============================
describe("POST /auth/login", () => {
    it("sollte erfolgreich einloggen und Token zurückgeben", async () => {
        const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mocked_token");

        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token", "mocked_token");
    });

    it("sollte fehlschlagen, wenn Benutzer nicht existiert", async () => {
        User.findOne.mockResolvedValue(null);

        const response = await request(app)
            .post("/auth/login")
            .send({ email: "notfound@example.com", password: "password123" });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("msg", "Ungültige Anmeldeinformationen");
    });

    it("sollte fehlschlagen, wenn das Passwort falsch ist", async () => {
        const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false);

        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@example.com", password: "wrongpassword" });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("msg", "Ungültige Anmeldeinformationen");
    });
});

// ===============================
// LOGOUT TEST
// ===============================
describe("POST /auth/logout", () => {
    it("sollte erfolgreich ausloggen", async () => {
        const response = await request(app).post("/auth/logout");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("msg", "Logout erfolgreich.");
    });
});

// ===============================
// REGISTER TESTS
// ===============================
describe("POST /auth/register", () => {
    it("sollte Benutzer erfolgreich registrieren", async () => {
        User.findOne.mockResolvedValue(null); // Kein bestehender Benutzer
        bcrypt.hash.mockResolvedValue("hashedPassword123");
        User.create.mockResolvedValue({ id: 1, username: "test", email: "test@example.com" });

        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "test",
                email: "test@example.com",
                password: "securePassword123"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("message", "Benutzer erfolgreich erstellt.");
        expect(User.create).toHaveBeenCalledWith({
            username: "test",
            email: "test@example.com",
            password: "hashedPassword123",
        });
    });

    it("sollte fehlschlagen, wenn das Passwort zu kurz ist", async () => {
        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "test",
                email: "test@example.com",
                password: "short"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Das Passwort muss mindestens 12 Zeichen lang sein.");
    });

    it("sollte fehlschlagen, wenn E-Mail bereits existiert", async () => {
        User.findOne.mockResolvedValue({ id: 1, email: "test@example.com" });

        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "test",
                email: "test@example.com",
                password: "securePassword123"
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Benutzer mit dieser E-Mail existiert bereits.");
    });

    it("sollte 500 zurückgeben bei Serverfehler", async () => {
        User.findOne.mockRejectedValue(new Error("DB Fehler"));

        const response = await request(app)
            .post("/auth/register")
            .send({
                username: "test",
                email: "test@example.com",
                password: "securePassword123"
            });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message", "Interner Serverfehler.");
    });
});
