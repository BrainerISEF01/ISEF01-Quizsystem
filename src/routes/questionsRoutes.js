const express = require("express");
const { Question } = require("../models");
const question = require("../models/question");
const router = express.Router();

// Add individual question
router.post("/add", async (req, res) => {
    try {
        const { question, correctAnswer, created_by } = req.body;

        const newQuestion = await Question.create({
            question,
            optins: JSON.stringify(options),
            correctAnswer, 
            created_by
             });

        res.json({ msg: "Frage hinzugefügt", newQuestion });
    } catch (err) {
        console.error("Fehler beim Hinzufügen der Frage:", err);
        res.status(500).json({ msg: "Fehler beim Hinzufügen der Frage" });
    }
});

// Add multiple questions
router.post("addMultiple", async(req, res) => {
    try {
        const questions = req.body.questions // array of questions

        await Question.bulkCreate(
            questions.map(q => ({
                question: q.question,
                options: JSON.stringify(q.question),
                correctAnswer: q.correctAnswer,
                created_by: q.created_by
            }))
        );

        res.json({msg: `${question.length} Fragen hinzugefügt`});
    } catch (err) {
        console.error("Fehler beim Stapel-Hinzufügen von Fragen:", err);
        res.status(500).json({msg: "Fehler beim Speichern der Fragen"})
    }
})

module.exports = router;
