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

  // getUserById: (id, callback) => {
  //   db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
  //     callback(err, row);
  //   });
  // },

  getUserById: (id, callback) => {
    console.log("Querying user with ID:", id);
    const query = "SELECT * FROM users WHERE id = ?";

    db.get(query, [id], (err, row) => {
      console.log("Query results:", { err, row });

      if (err) {
        console.error("Database query error:", err);
        return callback(err, null);
      }

      if (!row) {
        console.warn("No user found for ID:", id);
        return callback(null, null);
      }

      callback(null, row);
    });
  },

  getUserByUsername: (username, callback) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      callback(err, row);
    });
  },
  deleteUser: (id, callback) => {
    const stmt = db.prepare("DELETE FROM users WHERE id = ?");
    stmt.run(id, function (err) {
      callback(err, this.changes);
    });
    stmt.finalize();
  },
  checkUserExists: (id, callback) => {
    db.get(
      "SELECT COUNT(*) as count FROM users WHERE id = ?",
      [id],
      (err, row) => {
        if (err) {
          return callback(err, false);
        }
        callback(null, row.count > 0);
      }
    );
  },

  changePassword: (id, oldPassword, newPassword, callback) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
      if (err) {
        return callback(err);
      }

      if (!user) {
        return callback(new Error("User not found"));
      }

      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        if (err) {
          return callback(err);
        }

        if (!isMatch) {
          return callback(new Error("Incorrect old password"));
        }

        bcrypt.hash(newPassword, 10, (err, hash) => {
          if (err) {
            return callback(err);
          }

          const stmt = db.prepare("UPDATE users SET password = ? WHERE id = ?");
          stmt.run(hash, id, function (err) {
            if (err) {
              return callback(err);
            }

            callback(null, this.changes > 0);
          });
          stmt.finalize();
        });
      });
    });
  },
};
