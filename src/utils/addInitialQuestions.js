const { Question } = require("../models");

//adding intitial questions to the database
const initialQuestions = [
    {
        question: "Welches ist das größte Säugetier der Welt?",
        options: ["Blauwal", "Elefant", "Giraffe", "Nashorn"],
        correctAnswer: "Blauwal",
        created_by: 1  
    },
    {
        question: "Wie viele Planeten hat unser Sonnensystem?",
        options: ["8", "7", "9", "10"],
        correctAnswer: "8",
        created_by: 1  
    },
    {
        question: "Welches Element hat das chemische Symbol" +  " O " + "?" ,
        options: ["Sauerstoff", "Gold", "Silber", "Wasserstoff"],
        correctAnswer: "Sauerstoff",
        created_by: 1  
    },
    {
        question: "Wie viele Kontinente gibt es auf der Erde?",
        options: ["7", "5", "6", "8"],
        correctAnswer: "7",
        created_by: 1  
    },
    {
        question: "Wer war der erste Präsident der USA?",
        options: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "John Adams"],
        correctAnswer: "George Washington",
        created_by: 1  
    },
    {
        question: "In welchem Jahr begann der Zweite Weltkrieg?",
        options: ["1939", "1941", "1918", "1945"],
        correctAnswer: "1939",
        created_by: 1  
    },
    {
        question: "Wer war der erste Kaiser von Rom?",
        options: ["Augustus", "Nero", "Julius Cäsar", "Konstantin der Große"],
        correctAnswer: "Augustus",
        created_by: 1  
    },
    {
        question: "Wann endete der Erste Weltkrieg?",
        options: ["1918", "1914", "1923", "1939"],
        correctAnswer: "1918",
        created_by: 1  
    },
    {
        question: "Was bedeutet HTML?",
        options: ["Hypertext Markup Language", "Hyperlink Text Management Language", "High-Tech Machine Learning", "Home Tool Markup Language"],
        correctAnswer: "Hypertext Markup Language",
        created_by: 1  
    },
    {
        question: "Was ist die Binärdarstellung von 10?",
        options: ["1010", "1100", "1001", "1111"],
        correctAnswer: "1010",
        created_by: 1  
    },
    {
        question: "Wofür steht CPU?",
        options: ["Central Processing Unit", "Core Power Unit", "Computer Program Utility", "Central Process Usage"],
        correctAnswer: "Central Processing Unit",
        created_by: 1  
    },
    {
        question: "Welche Zahlensysteme nutzen Computer?",
        options: ["Binär und Hexadezimal", "Dezimal und Oktal", "Römische Zahlen", "Ternär und Quaternär"],
        correctAnswer: "Binär und Hexadezimal",
        created_by: 1  
    },
    {
        question: "Was ist 2+2?",
        options: ["4", "44", "-4", "1"],
        correctAnswer: "4",
        created_by: 1  
    },
    {
        question: "Was ist 10x10?",
        options: ["100", "10", "0", "50"],
        correctAnswer: "100",
        created_by: 1  
    },
    {
        question: "Was ist die Quadratwurzel von 144?",
        options: ["12", "14", "16", "10"],
        correctAnswer: "12",
        created_by: 1  
    },
    {
        question: "Wie viel ist 7 x 8?",
        options: ["56", "54", "49", "6"],
        correctAnswer: "56",
        created_by: 1  
    },
    {
        question: "Wer ist das Staatsoberhaupt Deutschlands?",
        options: ["Bundespräsident", "Bundeskanzler", "Verteidigungsminister", "Innenminister"],
        correctAnswer: "Bundespräsident",
        created_by: 1  
    },
    {
        question: "In welchem Jahr fiel die Berliner Mauer?",
        options: ["1989", "1991", "1987", "2000"],
        correctAnswer: "1989",
        created_by: 1  
    },
    {
        question: "Wie viele Spieler hat eine Fußballmannschaft auf dem Feld?",
        options: ["11", "10", "12", "9"],
        correctAnswer: "Paris",
        created_by: 1  
    },
    {
        question: "In welcher Stadt fanden die Olympischen Spiele 2016 statt?",
        options: ["Rio de Janeiro", "London", "Peking", "Tokio"],
        correctAnswer: "Rio de Janeiro",
        created_by: 1  
    },
]

// Insert into the database at startup
// Question.bulkCreate(initialQuestions.map(q => ({
//     question: q.question,
//     options: JSON.stringify(q.options),
//     correctAnswer: q.correctAnswer,
//     created_by: q.created_by
// }))).then(() => console.log("Initiale Fragen hinzugefügt!"))
// .catch(err => console.error("Fehler beim Einfügen:", err));