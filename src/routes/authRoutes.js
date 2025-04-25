const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists 
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ msg: "Ungültige Anmeldeinformationen" });
        }

        // Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Ungültige Anmeldeinformationen" });
        }

        // Create JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ msg: "Login erfolgreich", token });

    } catch (err) {
        console.error("Login-Fehler:", err);
        res.status(500).json({ msg: "Interner Serverfehler" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.json({ msg: "Logout erfolgreich." });
});


// Register User
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // check password length
        if (!password || password.length < 12) {
            return res.status(400).json({ message: "Das Passwort muss mindestens 12 Zeichen lang sein." });
        }

        // check if the user exsists
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Benutzer mit dieser E-Mail existiert bereits." });
        }

        // hash passwort
        const hashedPassword = await bcrypt.hash(password, 10);

        // create user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({ message: "Benutzer erfolgreich erstellt.", user: newUser });
    } catch (error) {
        return res.status(500).json({ message: "Interner Serverfehler." });
    }
});

module.exports = router;
