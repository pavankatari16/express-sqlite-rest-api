const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = path.join(__dirname, "..", "data", "app.sqlite");

function initDb() {
  const db = new Database(DB_PATH);

  // Create table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Seed data (only if empty)
  const row = db.prepare("SELECT COUNT(*) AS count FROM users").get();
  const count = row?.count ?? 0;

  if (count === 0) {
    const insert = db.prepare(
      "INSERT INTO users (id, name, email) VALUES (?, ?, ?)"
    );

    const samples = [
      { id: "u_1", name: "Alice Johnson", email: "alice@example.com" },
      { id: "u_2", name: "Bob Smith", email: "bob@example.com" },
      { id: "u_3", name: "Charlie Brown", email: "charlie@example.com" }
    ];

    for (const s of samples) {
      insert.run(s.id, s.name, s.email);
    }
  }

  return {
    db,
    run: (sql, params = []) => db.prepare(sql).run(...params),
    get: (sql, params = []) => db.prepare(sql).get(...params),
    all: (sql, params = []) => db.prepare(sql).all(...params),
  };
}

module.exports = { initDb };