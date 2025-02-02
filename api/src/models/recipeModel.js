const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.sqlite");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      picture TEXT,  -- Image path
      ingredients TEXT,  -- JSON encoded array of ingredients
      likes INTEGER DEFAULT 0,
      userId INTEGER,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

module.exports = {
  createRecipe: (
    title,
    description,
    picture,
    ingredients,
    userId,
    callback
  ) => {
    const stmt = db.prepare(
      "INSERT INTO recipes (title, description, picture, ingredients, likes, userId) VALUES (?, ?, ?, ?, 0, ?)"
    );
    stmt.run(
      title,
      description,
      picture,
      JSON.stringify(ingredients),
      userId,
      function (err) {
        callback(err, this.lastID);
      }
    );
    stmt.finalize();
  },

  getRecipeById: (id, callback) => {
    db.get("SELECT * FROM recipes WHERE id = ?", [id], (err, row) => {
      if (row) {
        row.ingredients = JSON.parse(row.ingredients);
      }
      callback(err, row);
    });
  },

  getAllRecipes: (callback) => {
    db.all("SELECT * FROM recipes", [], (err, rows) => {
      if (rows) {
        rows.forEach((row) => {
          row.ingredients = JSON.parse(row.ingredients);
        });
      }
      callback(err, rows);
    });
  },

  updateRecipe: (
    id,
    title,
    description,
    picture,
    ingredients,
    userId,
    callback
  ) => {
    const stmt = db.prepare(
      "UPDATE recipes SET title = ?, description = ?, picture = ?, ingredients = ? WHERE id = ? AND userId = ?"
    );
    stmt.run(
      title,
      description,
      picture,
      JSON.stringify(ingredients),
      id,
      userId,
      function (err) {
        callback(err, this.changes);
      }
    );
    stmt.finalize();
  },

  deleteRecipe: (id, userId, callback) => {
    const stmt = db.prepare("DELETE FROM recipes WHERE id = ? AND userId = ?");
    stmt.run(id, userId, function (err) {
      callback(err, this.changes);
    });
    stmt.finalize();
  },

  likeRecipe: (id, callback) => {
    const stmt = db.prepare(
      "UPDATE recipes SET likes = likes + 1 WHERE id = ?"
    );
    stmt.run(id, function (err) {
      callback(err, this.changes);
    });
    stmt.finalize();
  },

  dislikeRecipe: (id, callback) => {
    const stmt = db.prepare(
      "UPDATE recipes SET likes = likes - 1 WHERE id = ?"
    );
    stmt.run(id, function (err) {
      callback(err, this.changes);
    });
    stmt.finalize();
  },
};
