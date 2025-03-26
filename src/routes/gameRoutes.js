const express = require("express");
const { Quiz, Question, Leaderboard } = require("../models");
const router = express.Router();

// Save active games for 1v1 matchmaking
const activeGames = {}; // { gameId: { players: [userId], questions: [...], currentQuestionIndex: 0, scores: { userId: score }, timer: 120 } }

// Matchmaking for 1v1
router.post("/", async (req, res) => {
    try {
        const { userId, timerDuration } = req.body;

        // Check for an open game with only one player
        const openGame = Object.entries(activeGames).find(([gameId, game]) => game.players.length === 1);

        if (openGame) {
            // The player joins an existing game
            const [gameId, game] = openGame;
            game.players.push(userId);
            activeGames[gameId] = game;

            // Send a response to the client
            res.json({ msg: "Spiel gefunden!", gameId });
        } else {
            // Create a new game
            const questions = await Question.findAll({ limit: 10 });
            const gameId = `game_${Date.now()}`;

            activeGames[gameId] = {
                players: [userId],
                questions: questions.map(q => ({
                    id: q.id,
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer
                })),
                currentQuestionIndex: 0,
                scores: { [userId]: 0 },
                timer: timerDuration,
            };

            res.json({ msg: "Warte auf Gegner...", gameId });
        }
    } catch (err) {
        console.error("Fehler beim Matchmaking:", err);
        res.status(500).json({ msg: "Fehler beim Matchmaking" });
    }
});

// Export the router
module.exports = router; // Export the router
//module.exports = { router };
//module.exports.activeGames = activeGames; //export activeGames