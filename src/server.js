const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Quiz, Question, Leaderboard } = require("./models");
const authRoutes = require("./routes/authRoutes.js");
const leaderboardRoutes = require("./routes/leaderboardRoutes.js");
const questionsRoutes = require("./routes/questionsRoutes.js");
const quizRoutes = require("./routes/quizRoutes.js");
const gameRoutes = require("./routes/gameRoutes.js");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors({ origin: "*" }));
app.use(express.json());

// Routen
app.use("/auth", authRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/questions", questionsRoutes);
app.use("/quiz", require("./routes/quizRoutes")(io));
app.use("/matchmaking", gameRoutes);

// // bypass for ngrok-Warningpage - no need the bypass anymore becauce I have bought the premium plan where the warningpage ist automatically disables 
// app.use((req, res, next) => {
//     res.set("ngrok-skip-browser-warning", "true");
//     next();
// });

const PORT = process.env.PORT || 4000;

// Serve static React files
 //app.use(express.static(path.join(__dirname, "..", "Frontend", "build")));

// // app.get('*', (req, res) => { -> react catch-all Route, redirect all unkonwn routes back to the React app
//   res.sendFile(path.join(__dirname, "..", "Frontend", "build", "index.html"));
// });

// app.get("*", (req, res) => {
/**
 * Handles socket connections and game-related events.
 * 
 * @param {Object} socket - The socket object representing the client connection.
 */
io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    /**
     * Handles a player joining a game.
     * 
     * @param {Object} data - The data object containing game join information.
     * @param {string} data.username - The username of the player joining the game.
     * @param {string} data.gameId - The unique identifier of the game being joined.
     * @param {string} [data.mode] - The game mode, if "computer" it indicates a game against AI.
     */
    socket.on("joinGame", (data) => {
        const { username, gameId } = data;

        console.log(`${username} hat sich mit der ID ${socket.id} dem Spiel ${gameId} angeschlossen.`);

        socket.join(gameId);
        io.to(gameId).emit("playerJoined", { username, msg: `${username} ist dem Spiel beigetreten!` });

        if (data.mode === "computer") {
            setTimeout(() => {
                io.to(gameId).emit("computerJoined", { msg: "Der Computer ist bereit!" });
            }, 1000);
        }
    });

    /**
     * Handles a player submitting an answer to a question.
     * 
     * @param {Object} data - The data object containing answer submission information.
     * @param {string} data.gameId - The unique identifier of the game.
     * @param {string} data.userId - The unique identifier of the user submitting the answer.
     * @param {string} data.questionId - The unique identifier of the question being answered.
     * @param {string} data.answer - The answer submitted by the player.
     */
    socket.on("submitAnswer", async (data) => {
        try {
            const { gameId, userId, questionId, answer } = data;
            const question = await Question.findByPk(questionId);

            if (!question) {
                socket.emit("error", { msg: "Frage nicht gefunden!" });
                return;
            }

            const correct = answer === question.correctAnswer;
            const points = correct ? 10 : 0;

            await Leaderboard.create({ user_id: userId, quiz_id: gameId, score: points });

            io.to(gameId).emit("updateScore", { user: userId, score: points });

        } catch (err) {
            console.error("Fehler bei der Antwortverarbeitung:", err);
            socket.emit("error", { msg: "Ein Fehler ist aufgetreten!" });
        }
    });

    /**
     * Handles the end of a game.
     * 
     * @param {Object} data - The data object containing game end information.
     * @param {string} data.gameId - The unique identifier of the game that is ending.
     */
    socket.on("endGame", async (data) => {
        try {
            const { gameId } = data;
            const finalScores = await Leaderboard.findAll({ where: { quiz_id: gameId }, order: [["score", "DESC"]] });

            io.to(gameId).emit("gameOver", { msg: "Spiel beendet!", finalScores });
        } catch (err) {
            console.error("Fehler beim Beenden des Spiels:", err);
        }
    });

    /**
     * Handles a player disconnecting from the game.
     */
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} hat die Verbindung getrennt.`);
    });
});
//   res.sendFile(path.join(__dirname, "..", "Frontend", "build", "index.html"));
// });

// WebSocket connection for game events
io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Player joins a game (1v1 or against the computer)
    socket.on("joinGame", (data) => {
        const { username, gameId } = data;

        console.log(`${username} hat sich mit der ID ${socket.id} dem Spiel ${gameId} angeschlossen.`);

        socket.join(gameId);
        io.to(gameId).emit("playerJoined", { username, msg: `${username} ist dem Spiel beigetreten!` });

        // Notify when a computer joins
        if (data.mode === "computer") {
            setTimeout(() => {
                io.to(gameId).emit("computerJoined", { msg: "Der Computer ist bereit!" });
            }, 1000);
        }
    });

    socket.on("gameCreated",(data) => {
        const {username,gameId} = data;
        console.log(`${username} created game ${gameId}`);
        io.emit("gameCreatedOk",{status:1,username:username,gameId:gameId});
    });

    socket.on("gameDone",(data) => {
        const {username,gameId} = data;
        console.log(`${username} game done ${gameId}`);
        io.emit("gameDoneOk",{status:1,username:username,gameId:gameId});
    });

    // player sends an answer
    socket.on("submitAnswer", async (data) => {
        try {
            const { gameId, userId, questionId, answer } = data;
            const question = await Question.findByPk(questionId);

            if (!question) {
                socket.emit("error", { msg: "Frage nicht gefunden!" });
                return;
            }

            // validate answer
            const correct = answer === question.correctAnswer;
            const points = correct ? 10 : 0;

            // update leaderboard
            await Leaderboard.create({ user_id: userId, quiz_id: gameId, score: points });

            // Send score to all players
            io.to(gameId).emit("updateScore", { user: userId, score: points });

        } catch (err) {
            console.error("Fehler bei der Antwortverarbeitung:", err);
            socket.emit("error", { msg: "Ein Fehler ist aufgetreten!" });
        }
    });

    // end game
    socket.on("endGame", async (data) => {
        try {
            const { gameId } = data;
            const finalScores = await Leaderboard.findAll({ where: { quiz_id: gameId }, order: [["score", "DESC"]] });

            io.to(gameId).emit("gameOver", { msg: "Spiel beendet!", finalScores });
        } catch (err) {
            console.error("Fehler beim Beenden des Spiels:", err);
        }
    });

    // The player disconnects
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} hat die Verbindung getrennt.`);
    });
});

server.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});

module.exports = { io, server };
