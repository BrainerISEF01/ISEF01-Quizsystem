const { Sequelize } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize("quiz_db", "root", "{[%C&cn1,RN1=T@:x7Yz", {
  host: "127.0.0.1",
  dialect: "mysql"
});

sequelize.authenticate()
  .then(() => console.log("Datenbank erfolgreich verbunden!"))
  .catch((error) => console.error("Fehler bei der Verbindung:", error));
