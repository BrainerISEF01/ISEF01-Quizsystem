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
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// CORS-Konfiguration (Whitelist)
const allowedOrigins = ['http://localhost:3001', process.env.ALLOWED_ORIGIN].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Express Middlewares
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});
app.use(limiter);

const blockedIps = ['45.126.187.15'];

app.use((req, res, next) => {
  if (blockedIps.includes(req.ip)) {
    return res.status(403).send('Access denied');
  }
  next();
});


// IP-Whitelist
app.use((req, res, next) => {
  const allowedIps = ['::1', '127.0.0.1', '::ffff:127.0.0.1'];
  if (allowedIps.includes(req.ip)) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
});

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Routen
app.use("/auth", authRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/questions", questionsRoutes);
app.use("/quiz", quizRoutes(io)); // Funktion die io verwendet
app.use("/matchmaking", gameRoutes);

// React-Frontend deployment -> just for the production environment
// app.use(express.static(path.join(__dirname, "..", "Frontend", "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "..", "Frontend", "build", "index.html"));
// });

// WebSocket Events
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("joinGame", (data) => {
    const { username, gameId, mode } = data;
    console.log(`${username} joined game ${gameId}`);
    socket.join(gameId);
    io.to(gameId).emit("playerJoined", { username, msg: `${username} ist dem Spiel beigetreten!` });

    if (mode === "computer") {
      setTimeout(() => {
        io.to(gameId).emit("computerJoined", { msg: "Der Computer ist bereit!" });
      }, 1000);
    }
  });

  socket.on("gameCreated", (data) => {
    const { username, gameId } = data;
    console.log(`${username} created game ${gameId}`);
    io.emit("gameCreatedOk", { status: 1, username, gameId });
  });

  socket.on("gameDone", (data) => {
    const { username, gameId } = data;
    console.log(`${username} game done ${gameId}`);
    io.emit("gameDoneOk", { status: 1, username, gameId });
  });

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

  socket.on("endGame", async (data) => {
    try {
      const { gameId } = data;
      const finalScores = await Leaderboard.findAll({
        where: { quiz_id: gameId },
        order: [["score", "DESC"]],
      });
      io.to(gameId).emit("gameOver", { msg: "Spiel beendet!", finalScores });
    } catch (err) {
      console.error("Fehler beim Beenden des Spiels:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} hat die Verbindung getrennt.`);
  });
});

// Serverstart
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});

module.exports = { io, server };
