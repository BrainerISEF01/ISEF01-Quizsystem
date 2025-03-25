const express = require("express");
const { Question, Leaderboard } = require("../models"); 
const router = express.Router();

// Importiere die WebSocket-Instanz
module.exports = (io) => {
    // Storage für laufende Quizspiele
    const activeQuizzes = {}; // { quizId: { questions: [...], participants: [...], timerDuration: 120 } }

    // Quiz starten (1v1 oder gegen den Computer)
    router.post("/start", async (req, res) => {
        try {
            const { mode, user_id, opponent_id, timerDuration } = req.body;

            let opponent = opponent_id || "computer"; // Wenn kein Gegner, spiele gegen den Computer
            const questions = await Question.findAll({ limit: 10 });

            const quizId = `quiz_${Date.now()}`; // Erzeugt eine Quiz-ID

            activeQuizzes[quizId] = {
                questions: questions.map(q => ({
                    id: q.id,
                    question: q.question,
                    correctAnswer: q.correctAnswer
                })),
                participants: [user_id, opponent],
                timerDuration
            };

            res.json({ msg: "Quiz gestartet", quizId, mode, questions, timerDuration });

            // Timer für das Quiz starten
            setTimeout(async () => {
                io.to(quizId).emit("gameOver", { msg: "Zeit abgelaufen!", finalScores: await getFinalScores(quizId) });
                delete activeQuizzes[quizId]; // Quiz nach Ablauf löschen
            }, timerDuration * 1000);

        } catch (err) {
            console.error("Quiz-Start-Fehler", err);
            res.status(500).json({ msg: "Fehler beim Starten des Quiz" });
        }
    });

    // Antwort senden (einschließlich Logik für den Computer)
    router.post("/submit", async (req, res) => {
        try {
            const { quizId, questionId, answer, userId } = req.body;
            const question = await Question.findByPk(questionId);

            if (!question) return res.status(404).json({ msg: "Frage nicht gefunden" });

            // Antwort validieren
            const correct = answer === question.correctAnswer;
            const points = correct ? 10 : 0;

            // Leaderboard aktualisieren
            await Leaderboard.create({ user_id: userId, quiz_id: quizId, score: points });

            // Live-Update an alle Spieler senden
            io.to(quizId).emit("updateScore", { user: userId, score: points });

            // Computer antwortet zufällig, wenn nötig
            if (activeQuizzes[quizId] && activeQuizzes[quizId].participants.includes("computer")) {
                setTimeout(async () => {
                    const randomAnswer = question.correctAnswer; // Hier könnte auch eine zufällige Antwort generiert werden
                    const computerCorrect = randomAnswer === question.correctAnswer;
                    const computerPoints = computerCorrect ? 10 : 0;

                    await Leaderboard.create({ user_id: "computer", quiz_id: quizId, score: computerPoints });

                    io.to(quizId).emit("computerAnswered", { answer: randomAnswer, score: computerPoints });
                }, Math.floor(Math.random() * 3000) + 1000); // 1-3 Sekunden Verzögerung
            }

            res.json({ msg: correct ? "Richtig!" : "Falsch!", points });

        } catch (err) {
            console.error("Fehler beim Absenden der Antwort:", err);
            res.status(500).json({ msg: "Fehler beim Absenden der Antwort" });
        }
    });

    // Zugriff auf den Ligamodus (Top 10 Spieler)
    router.get("/league", async (req, res) => {
        try {
            const scores = await Leaderboard.findAll({ order: [["score", "DESC"]], limit: 10 });
            res.json(scores);

            // WebSocket-Update für die Liga
            io.emit("updateLeague", scores);
        } catch (err) {
            console.error("Fehler beim Abrufen des Ligamodus:", err);
            res.status(500).json({ msg: "Fehler beim Abrufen des Ligamodus" });
        }
    });

    // Hilfsfunktion für das Endergebnis
    async function getFinalScores(quizId) {
        return await Leaderboard.findAll({ where: { quiz_id: quizId }, order: [["score", "DESC"]] });
    }

    return router; // Router zurückgeben
};
