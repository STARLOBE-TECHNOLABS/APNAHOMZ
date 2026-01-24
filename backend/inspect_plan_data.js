const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  db.get("SELECT data FROM plans LIMIT 1", (err, row) => {
    if (err) {
      console.error("Error:", err);
      return;
    }
    if (row) {
      console.log("--- RAW JSON STORED IN DB (First Plan) ---");
      console.log(JSON.stringify(JSON.parse(row.data), null, 2));
    } else {
      console.log("No plans found to display.");
    }
  });
});

db.close();
