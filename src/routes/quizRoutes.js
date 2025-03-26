const express = require("express");
const { Question, Leaderboard } = require("../models"); 
const router = express.Router();

// import the WebSocket instance
module.exports = (io) => {

    // Storage for running quizzes
    const activeQuizzes = {}; // { quizId: { questions: [...], participants: [...], timerDuration: 120 } }

    // Start quiz (1v1 or against the computer)
    router.post("/start", async (req, res) => {
        try {
            const { mode, user_id, opponent_id, timerDuration } = req.body;

            let opponent = opponent_id || "computer"; // if no player, play against the computer
            const questions = await Question.findAll({ limit: 10 });

            const quizId = `quiz_${Date.now()}`; // Creates a quiz ID

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

            // start Timer for the quiz
            setTimeout(async () => {
                io.to(quizId).emit("gameOver", { msg: "Zeit abgelaufen!", finalScores: await getFinalScores(quizId) });
                delete activeQuizzes[quizId]; // Delete quiz after expiry
            }, timerDuration * 1000);

        } catch (err) {
            console.error("Quiz-Start-Fehler", err);
            res.status(500).json({ msg: "Fehler beim Starten des Quiz" });
        }
    });

    // send answer (including logic for the computer)
    router.post("/submit", async (req, res) => {
        try {
            const { quizId, questionId, answer, userId } = req.body;
            const question = await Question.findByPk(questionId);

            if (!question) return res.status(404).json({ msg: "Frage nicht gefunden" });

            // validate answer
            const correct = answer === question.correctAnswer;
            const points = correct ? 10 : 0;

            // update Leaderboard
            await Leaderboard.create({ user_id: userId, quiz_id: quizId, score: points });

            // Send live update to all players
            io.to(quizId).emit("updateScore", { user: userId, score: points });

            // Computer answers randomly if necessary
            if (activeQuizzes[quizId] && activeQuizzes[quizId].participants.includes("computer")) {
                setTimeout(async () => {
                    const randomAnswer = question.correctAnswer; 
                    const computerCorrect = randomAnswer === question.correctAnswer;
                    const computerPoints = computerCorrect ? 10 : 0;

                    await Leaderboard.create({ user_id: "computer", quiz_id: quizId, score: computerPoints });

                    io.to(quizId).emit("computerAnswered", { answer: randomAnswer, score: computerPoints });
                }, Math.floor(Math.random() * 3000) + 1000); // 1-3 Seconds delay
            }

            res.json({ msg: correct ? "Richtig!" : "Falsch!", points });

        } catch (err) {
            console.error("Fehler beim Absenden der Antwort:", err);
            res.status(500).json({ msg: "Fehler beim Absenden der Antwort" });
        }
    });

    // Access to League Mode (Top 10 Players)
    router.get("/league", async (req, res) => {
        try {
            const scores = await Leaderboard.findAll({ order: [["score", "DESC"]], limit: 10 });
            res.json(scores);

            // WebSocket-Update for the league
            io.emit("updateLeague", scores);
        } catch (err) {
            console.error("Fehler beim Abrufen des Ligamodus:", err);
            res.status(500).json({ msg: "Fehler beim Abrufen des Ligamodus" });
        }
    });

    // helperfunction for the final result
    async function getFinalScores(quizId) {
        return await Leaderboard.findAll({ where: { quiz_id: quizId }, order: [["score", "DESC"]] });
    }

    return router;
};
