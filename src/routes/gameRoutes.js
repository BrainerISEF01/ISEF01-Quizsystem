const express = require("express");
const { Quiz, Question, Leaderboard, GameData } = require("../models");
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
            res.json({ msg: "Spiel gefunden!", userId, gameId });
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

            res.json({ msg: "Warte auf Gegner...", userId, gameId });
        }
    } catch (err) {
        console.error("Fehler beim Matchmaking:", err);
        res.status(500).json({ msg: "Fehler beim Matchmaking" });
    }
});

// Create data gameid
router.post("/create", async (req, res) => {
    try {
        const { gameId, userId, userEmail, mode, timerDuration, opponentId, opponentEmail,status } = req.body;

        // Check if the gameId already exists
        const existingGame = await GameData.findOne({ where: { gameId } });
        if (existingGame) {
            return res.status(400).json({ msg: "Game ID already exists" });
        }

        // Create a new game entry
        const newGameId = await GameData.create({
            gameId,
            userId,
            userEmail, 
            mode,
            timerDuration,
            opponentId,
            opponentEmail,
            status
        });
        res.json({ msg: gameId+" created", newGameId });
    } catch (err) {
        console.error("Error Create Game:", err);
        res.status(500).json({ msg: "Error Create Game" });
    }
});

// Show list game data where status 1
router.get("/list", async (req, res) => {
    try {
        const games = await GameData.findAll({ where: { status: 1 }, order: [["createdAt", "DESC"]] });
        res.json(games);
    } catch (err) {
        console.error("Error fetching game data:", err);
        res.status(500).json({ msg: "Error fetching game data" });
    }
});

// Update game data op
router.post("/update-op", async (req, res) => {
    try {
        const { gameId, opponentId, opponentEmail } = req.body;

        // Find the game entry
        const game = await GameData.findOne({ where: { gameId } });
        if (!game) {
            return res.status(404).json({ msg: "Game not found" });
        }

        // Update the scores
        game.opponentId = opponentId;
        game.opponentEmail = opponentEmail;
        await game.save();

        // Send a response to the client
        const updatedGame = await GameData.findOne({ where: { gameId } });

        res.json({ msg: "Game ID "+ gameId +" updated", updatedGame });
    } catch (err) {
        console.error("Error updating game:", err);
        res.status(500).json({ msg: "Error updating game" });
    }
});

// Show game data 
router.post("/ende", async (req, res) => {
    try {
        const { gameId } = req.body;

        // Find the game entry
        const game = await GameData.findOne({ where: { gameId } });
        if (!game) {
            return res.status(404).json({ msg: "Game not found" });
        }

        res.json(game);
    } catch (err) {
        console.error("Error fetching game data:", err);
        res.status(500).json({ msg: "Error fetching game data" });
    }
});

// Update game data status
router.post("/updateStatus", async (req, res) => {
    try {
        const { gameId, status } = req.body;

        // Find the game entry
        const game = await GameData.findOne({ where: { gameId } });
        if (!game) {
            return res.status(404).json({ msg: "Game not found" });
        }

        // Update the status
        game.status = status;
        await game.save();

        // Send a response to the client
        res.json({ msg: "Game ID "+ gameId +" end", game });
    } catch (err) {
        console.error("Error updating game:", err);
        res.status(500).json({ msg: "Error updating game" });
    }
});

// Export the router
module.exports = router; // Export the router
