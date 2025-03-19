const express = require("express");
const { Quiz, Question, Leaderboard, Sequelize } = require("../models");
const router = express.Router();

// start quiz (1v1 oder against the computer)
router.post("/start", async (req, res) => {
    try {
        const { mode, user_id, opponent_id } = req.body;

        let opponent = opponent_id; // if 1v1, use the oppenent
        if (mode === "computer") {
            opponent = "computer"; // Dummy opponent
        }

        //choosing a random answer. vs the computer
         const questions = await Question.findAll({order: Sequelize.literal('RAND()'), limit: 10});

        const quiz = await Quiz.create({
            questions: JSON.stringify(questions),
            participants: JSON.stringify([user_id, opponent]),
        });

        res.json({ msg: "Quiz gestartet", quizId: quiz.id, mode, questions });
    } catch (err) {
        console.error("Quiz-Start-Fehler", err);
        res.status(500).json({ msg: "Fehler beim Starten des Quiz" });
    }
});

// answer question (with Timer)
router.post("/submit", async (req, res) => {
    try {
        const { quizId, questionId, answer, userId } = req.body;
        const question = await Question.findByPk(questionId);

        if (!question) return res.status(404).json({ msg: "Frage nicht gefunden" });

        // Timer check (simulates that you have 10 seconds, 20% chance of timeout
        if (Math.random() > 0.8) {
            return res.status(400).json({ msg: "Zeit abgelaufen!" });
        }

        // validate user answers
        const correct = answer === question.correctAnswer;
        const userPoints = correct ? 10 : 0;

        // Computer gives random answer
        const computerAnswer = question.options[Math.floor(Math.random() * question.options.length)];
        const computerCorrect = computerAnswer === question.correctAnswer;
        const computerPoints = computerCorrect ? 10 : 0;

        // update leaderboard (User & Computer)
        await Leaderboard.create({ user_id: userId, quiz_id: quizId, score: userPoints });
        await Leaderboard.create({ user_id: "computer", quiz_id: quizId, score: computerPoints });

        res.json({
            msg: correct ? "Richtig!" : "Falsch!",
            userPoints,
            computerAnswer,
            computerPoints,
            result: correct ? "Du hast gepunktet!" : "Leider nicht!"
        });
    } catch (err) {
        console.error("Fehler beim Absenden der Antwort:", err);
        res.status(500).json({ msg: "Fehler beim Absenden der Antwort" });
    }
});


// League Mode (compare all scores)
router.get("/league", async (req, res) => {
    try {
        const scores = await Leaderboard.findAll({ order: [["score", "DESC"]] });
        res.json(scores);
    } catch (err) {
        res.status(500).json({ msg: "Fehler beim Abrufen des Ligamodus" });
    }
});

module.exports = router;
