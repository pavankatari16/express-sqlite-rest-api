const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "..", "data", "app.sqlite");

function createDb() {
  return new sqlite3.Database(DB_PATH);
}

function runAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function getAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function allAsync(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

async function initDb() {
  const db = createDb();

  try {
    await runAsync(
      db,
      `
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `
    );

    // Seed sample users on first run (table empty)
    const row = await getAsync(db, "SELECT COUNT(*) AS count FROM users");
    const count = row?.count ?? 0;

    if (count === 0) {
      const samples = [
        { id: "u_1", name: "Alice Johnson", email: "alice@example.com" },
        { id: "u_2", name: "Bob Smith", email: "bob@example.com" },
        { id: "u_3", name: "Charlie Brown", email: "charlie@example.com" }
      ];

      const insertSql =
        "INSERT INTO users (id, name, email) VALUES (?, ?, ?)";
      for (const s of samples) {
        await runAsync(db, insertSql, [s.id, s.name, s.email]);
      }
    }

    return {
      db,
      run: (sql, params) => runAsync(db, sql, params),
      get: (sql, params) => getAsync(db, sql, params),
      all: (sql, params) => allAsync(db, sql, params),
    };
  } catch (err) {
    db.close();
    throw err;
  }
}

module.exports = { initDb };

