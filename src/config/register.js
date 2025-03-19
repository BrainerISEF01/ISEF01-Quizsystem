const bcrypt = require ("bcrypt");
const { User } = require ("../models");

//Create User in DB
const registerUser = async (username, email, password) => {
    try {
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        //create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        console.log("Benutzer erstellt;", newUser.toJSON());
    } catch (error) {
        console.error("Fehler beim Erstellen des Users", error);
    }
};

//registerUser("Spieler1", "spieler1@gmail.com", "vJk4jcAylgnodMIn1RwI");