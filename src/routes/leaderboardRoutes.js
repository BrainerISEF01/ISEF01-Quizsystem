const express = require("express");
const { Leaderboard,GameData } = require("../models");

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

router.get("/result", async (req, res) => {
    try {
        const scores = await GameData.sequelize.query(
            "SELECT MODE,userEmail AS USER,scoreUser AS score FROM gamedata UNION ALL SELECT MODE,opponentEmail AS USER,scoreOpponent AS score FROM gamedata ORDER BY score DESC",
            { type: GameData.sequelize.QueryTypes.SELECT }
        );
        res.json(scores);
    } catch (err) {
        res.status(500).json({ msg: "Fehler beim Abrufen der Ergebnisse" });
    }
});

module.exports = router;
