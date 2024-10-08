const sqlite3 = require('sqlite3').verbose();

// Initialize and connect to the SQLite database
const db = new sqlite3.Database('./profile.db', (err) => {
  if (err) {
    console.error('Error connecting to the SQLite database:', err);
  } else {
    console.log('Connected to SQLite database.');
  }
});

// Create a table if it doesn't already exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT,
    phone TEXT
  )
`);

module.exports = db;
