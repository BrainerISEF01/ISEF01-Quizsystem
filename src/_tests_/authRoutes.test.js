const request = require("supertest");
const express = require("express");
const authRoutes = require("../routes/authRoutes");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// simulate Express-App for the tests
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

// Mocks for DB and JWT
jest.mock("../models", () => ({
    User: {
        findOne: jest.fn(),
    },
}));

jest.mock("bcrypt", () => ({
    compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(),
}));

// login tests
describe("POST /auth/login", () => {
    it("Sollte erfolgreich einloggen und Token zurückgeben", async () => {
        // Mock data of a user
        const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mocked_token");

        // send request 
        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@example.com", password: "password123" });

        // check expectations
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token", "mocked_token");
    });

    it("Sollte fehlschlagen, wenn Benutzer nicht existiert", async () => {
        User.findOne.mockResolvedValue(null); // no user found

        const response = await request(app)
            .post("/auth/login")
            .send({ email: "notfound@example.com", password: "password123" });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("msg", "Ungültige Anmeldeinformationen");
    });

    it("Sollte fehlschlagen, wenn das Passwort falsch ist", async () => {
        const mockUser = { id: 1, email: "test@example.com", password: "hashedpassword" };
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(false); // Password incorrect

        const response = await request(app)
            .post("/auth/login")
            .send({ email: "test@example.com", password: "wrongpassword" });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("msg", "Ungültige Anmeldeinformationen");
    });
});

// logout tests
describe("POST /auth/logout", () => {
    it("Sollte erfolgreich ausloggen", async () => {
        const response = await request(app).post("/auth/logout");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("msg", "Logout erfolgreich.");
    });
});
