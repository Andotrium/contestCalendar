const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
  path.join(__dirname, "../../data.db")
);

// Create table if not exists
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS added_contests (
      id TEXT PRIMARY KEY,
      platform TEXT,
      name TEXT,
      start_time TEXT
    )
  `);
});

module.exports = db;
