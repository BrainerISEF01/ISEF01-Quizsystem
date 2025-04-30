QuizGame API

Dies ist die offizielle API-Dokumentation für die QuizGame-Plattform – ein Multiplayer-Quizspiel mit Authentifizierung, Matchmaking, Fragenverwaltung und Live-Spielmechanik via WebSockets.

Basis-URL
https://bursting-heroic-akita.ngrok-free.app

Anmeldedaten: 

Spieler 1:  

E-Mail: spieler1@gmail.com 

Passwort: vJk4jcAylgnodMIn1RwI 

Nutzerdaten Spieler 2: 

 E-Mail: spieler2@gmail.com 

Passwort: D3BmXi7Hyw2xHtj952DG


Authentifizierung
POST /login
Meldet einen Benutzer an und gibt ein JWT-Token zurück.
Body:
{ "email": "user@example.com", "password": "password123" }
POST /logout
Beendet die Benutzersitzung.


POST /register
Registriert einen neuen Benutzer.
Body:
{ "username": "newUser", "email": "newuser@example.com", "password": "password1234" }

Spiel & Matchmaking
POST /
Startet 1v1-Matchmaking. Bestehende Spiele werden genutzt, sonst wird ein neues erstellt.

POST /create
Erstellt ein neues Spiel mit detaillierten Informationen.

GET /list
Gibt eine Liste aller aktiven Spiele zurück (Status = 1).

POST /update-op
Aktualisiert Gegnerinformationen eines Spiels.

Quizfunktionen
POST /quiz/start
Startet ein neues Quiz (1v1 oder vs. Computer).
Body enthält Modus, Nutzer-IDs und Timer.

POST /quiz/submit
Reicht die Antwort eines Spielers auf eine Frage ein.

POST /quiz/updateOpponentScore
Aktualisiert den Punktestand des Gegners.

GET /quiz/league
Zeigt die Top 10 Spieler der Rangliste an.

Fragenmanagement
POST /add
Fügt eine neue Frage hinzu.

POST /addMultiple
Fügt mehrere Fragen gleichzeitig hinzu.

Leaderboard
GET /
Gibt Spieler mit höchsten Scores und zugehörigen Fragen zurück.

GET /result
Zeigt alle Spielergebnisse mit Benutzer-Scores an.

WebSocket-Ereignisse

Ereignis      Beschreibung
joinGame:     Spieler tritt einem Spiel bei
submitAnswer: Spieler gibt eine Antwort ab
endGame	Beendet ein Spiel
updateScore:  Aktualisiert den Punktestand live
computerJoined: Der Computer tritt einem Spiel bei
gameOver:      Sendet finalen Punktestand


Fehlerbehandlung
Alle Endpunkte liefern bei Fehlern strukturierte JSON-Antworten mit HTTP-Statuscodes (400, 401, 404, 500).


Hinweis
Spiele und Quizze verwenden eine Kombination aus Benutzer-IDs, Spiel-IDs und dynamischer Punktelogik
  

 

 



