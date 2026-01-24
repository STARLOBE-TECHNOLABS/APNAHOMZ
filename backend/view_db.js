const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/database.sqlite');
const db = new sqlite3.Database(dbPath);

console.log("Connecting to database at:", dbPath);

db.serialize(() => {
  console.log("\n--- USERS TABLE ---");
  db.all("SELECT id, username, email, phone, created_at FROM users", (err, rows) => {
    if (err) {
      console.error("Error fetching users:", err.message);
      return;
    }
    if (rows.length === 0) {
        console.log("No users found.");
    } else {
        console.table(rows);
    }
  });

  console.log("\n--- PLANS TABLE ---");
  db.all("SELECT * FROM plans", (err, rows) => {
    if (err) {
      console.error("Error fetching plans:", err.message);
      return;
    }
    if (rows.length === 0) {
        console.log("No plans found in SQLite database.");
    } else {
        const plansSummary = rows.map(row => {
            let itemCount = 0;
            let wallCount = 0;
            try {
                const data = JSON.parse(row.data);
                itemCount = data.items ? data.items.length : 0;
                wallCount = data.walls ? data.walls.length : 0;
            } catch (e) {
                // ignore error
            }
            return {
                id: row.id,
                user_id: row.user_id,
                name: row.name,
                items: itemCount,
                walls: wallCount,
                updated: row.updated_at
            };
        });
        console.table(plansSummary);
    }
  });
});

db.close((err) => {
    if (err) {
        console.error(err.message);
    }
    console.log("\nDatabase connection closed.");
});
