const express = require("express");
const { Leaderboard } = require("../models");

const router = express.Router();

// retrieve Leaderboard (Top-Player)
router.get("/", async (req, res) => {
    try {
        const scores = await Leaderboard.findAll({ order: [["score", "DESC"]] });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ msg: "Fehler beim Abrufen des Leaderboards" });
    }
});

module.exports = router;
