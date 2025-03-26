const express = require("express");
const http = require("http"); // WebSockets require an HTTP server object
const { Server } = require("socket.io"); 
const { Quiz, Question, Leaderboard } = require("./models"); // import modells
const authRoutes = require("./routes/authRoutes.js");
const leaderboardRoutes = require("./routes/leaderboardRoutes.js");
const questionsRoutes = require("./routes/questionsRoutes.js");
const quizRoutes = require("./routes/quizRoutes.js");
const gameRoutes = require("./routes/gameRoutes.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = new Server(server, { cors: { origin: "*" } }); // WebSocket-Server with CORS

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/questions", questionsRoutes);
app.use("/quiz", require("./routes/quizRoutes")(io)); // Pass io instance
app.use("/matchmaking", gameRoutes);

// bypass for ngrok-Warningpage
app.use((req, res, next) => {
    res.set("ngrok-skip-browser-warning", "true");
    next();
});

const PORT = process.env.PORT || 4000;

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
        console.log(`❌ User ${socket.id} hat die Verbindung getrennt.`);
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT}`);
});

module.exports = { io }; // export io-Instance
