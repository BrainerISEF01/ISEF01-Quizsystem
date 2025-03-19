const express = require("express");
const http = require("http"); // WebSockets need a HTTP-Server-Obbject
const { Server } = require("socket.io"); 
const authRoutes = require("./routes/authRoutes.js");
const leaderboardRoutes = require("./routes/leaderboardRoutes.js");
const questionsRoutes = require("./routes/questionsRoutes.js");
const quizRoutes = require("./routes/quizRoutes.js");
const cors = require("cors");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // creates a HTTP-Sever
const io = new Server(server, { cors: { origin: "*" } }); // WebSocket-Server with CORS, every client send a request

app.use(cors({
    origin: "*",
}))
app.use(express.json());
app.use("/auth", authRoutes); 
app.use("/leaderboard", leaderboardRoutes);
app.use("/questions", questionsRoutes);
app.use("/quiz", quizRoutes);



const PORT = process.env.PORT || 3000;

io.on("connection", (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Player joins a game (1v1 or against computer)
    socket.on("joinGame", (data) => {
        const { username, gameId, mode } = data;

        console.log(`${username} hat sich mit der ID ${socket.id} dem Spiel ${gameId} angeschlossen.`);

        socket.join(gameId);
        io.to(gameId).emit("playerJoined", { username, msg: `${username} ist dem Spiel beigetreten!` });

        if (mode === "computer") {
            setTimeout(() => {
                io.to(gameId).emit("computerJoined", { msg: "Der Computer ist bereit!" });
            }, 1000);
        }
    });

    // Answer is given
    socket.on("answerSubmitted", async (data) => {
        const { gameId, userId, questionId, answer } = data;
        const question = await Question.findByPk(questionId);i

        if (!question) {
            socket.emit("error", { msg: "Frage nicht gefunden!" });
            return;
        }

        // validate answers
        const correct = answer === question.correctAnswer;
        const points = correct ? 10 : 0;

        // update Leaderboard
        await Leaderboard.create({ user_id: userId, quiz_id: gameId, score: points });

        // send score to all players
        io.to(gameId).emit("updateScore", { user: userId, score: points });

        // if game vs the computer → Computer answers randomly
        if (data.mode === "computer") {
            setTimeout(async () => {
                const randomAnswer = question.options[Math.floor(Math.random() * question.options.length)];
                const computerCorrect = randomAnswer === question.correctAnswer;
                const computerPoints = computerCorrect ? 10 : 0;

                await Leaderboard.create({ user_id: "computer", quiz_id: gameId, score: computerPoints });

                io.to(gameId).emit("computerAnswered", { answer: randomAnswer, score: computerPoints });
            }, 2000);
        }
    });

    // finshed game if all questions are answers 
    socket.on("endGame", (data) => {
        const { gameId } = data;
        io.to(gameId).emit("gameOver", { msg: "Spiel beendet!", finalScores: Leaderboard.findAll({ where: { quiz_id: gameId } }) });
    });

    // Live-Update for league mode
    socket.on("getLeague", async () => {
        const scores = await Leaderboard.findAll({ order: [["score", "DESC"]] });
        io.emit("updateLeague", scores);
    });

    // disconnect
    socket.on("disconnect", () => {
        console.log(`❌ User ${socket.id} hat die Verbindung getrennt.`);
    });
});


server.listen(PORT, () => {
    console.log(`Server runnning on Port ${PORT}`);
});
