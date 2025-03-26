const express = require("express");
const gameRoutes = require("./routes/gameRoutes");
const questionRoutes  = require("./routes/questionsRoutes")

const app = express();
app.use(express.json());
app.use("/matchmaking", gameRoutes); 
app.use("/", questionRoutes)

module.exports = app; // express app export without websockets. Used for testcase purpose
