const express = require("express");
const { Leaderboard, GameData, Question } = require("../models");

const router = express.Router();

// retrieve Leaderboard (Top-Player) und deren zugehörige Frage
router.get("/", async (req, res) => {
  try {
    const scores = await Leaderboard.findAll({
      include: [
        {
          model: Question,
          as: 'question',  // Alias, um auf die Assoziation zuzugreifen
        },
      ],
      order: [["score", "DESC"]],
    });
    res.json(scores);
  } catch (err) {
    res.status(500).json({ msg: "Fehler beim Abrufen des Leaderboards" });
  }
});

// retrieve Results aus GameData mit Score und Benutzerdaten
router.get("/result", async (req, res) => {
  try {
    const scores = await GameData.sequelize.query(
      "SELECT MODE, userEmail AS USER, scoreUser AS score FROM gamedata UNION ALL SELECT MODE, opponentEmail AS USER, scoreOpponent AS score FROM gamedata ORDER BY score DESC",
      { type: GameData.sequelize.QueryTypes.SELECT }
    );
    res.json(scores);
  } catch (err) {
    res.status(500).json({ msg: "Fehler beim Abrufen der Ergebnisse" });
  }
});

module.exports = router;
