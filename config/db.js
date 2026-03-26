const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dbDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dbDir, "app.sqlite");

// ✅ CREATE FOLDER IF NOT EXISTS
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

function initDb() {
  const db = new Database(dbPath);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  return {
    db,
    run: (sql, params = []) => db.prepare(sql).run(...params),
    get: (sql, params = []) => db.prepare(sql).get(...params),
    all: (sql, params = []) => db.prepare(sql).all(...params),
  };
}

module.exports = { initDb };