const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

module.exports = {
  createUser: (username, password, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return callback(err);
      const stmt = db.prepare(
        "INSERT INTO users (username, password) VALUES (?, ?)"
      );
      stmt.run(username, hash, function (err) {
        callback(err, this.lastID);
      });
      stmt.finalize();
    });
  },

  getUserById: (id, callback) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      callback(err, row);
    });
  },

  getUserByUsername: (username, callback) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      callback(err, row);
    });
  },
};
