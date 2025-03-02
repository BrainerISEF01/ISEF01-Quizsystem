const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize("quiz_db", "root", process.env.DB_PASSWORD, {
  host: "127.0.0.1",
  dialect: "mysql"
});

sequelize.authenticate()
  .then(() => console.log("Datenbank erfolgreich verbunden!"))
  .catch((error) => console.error("Fehler bei der Verbindung:", error));
