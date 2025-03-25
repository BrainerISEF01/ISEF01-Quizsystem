const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

const router = express.Router();

// Login Endpoint
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

module.exports = router;
