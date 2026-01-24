require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'floorlite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

const promisePool = pool.promise();

async function viewData() {
    try {
        console.log("\n--- USERS TABLE ---");
        const [users] = await promisePool.query("SELECT id, username, email, phone, created_at FROM users");
        if (users.length === 0) {
            console.log("No users found.");
        } else {
            console.table(users);
        }

        console.log("\n--- PLANS TABLE ---");
        const [plans] = await promisePool.query("SELECT * FROM plans");
        if (plans.length === 0) {
            console.log("No plans found in MySQL database.");
        } else {
            const plansSummary = plans.map(row => {
                let itemCount = 0;
                let wallCount = 0;
                try {
                    const data = (typeof row.data === 'string') ? JSON.parse(row.data) : row.data;
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

    } catch (error) {
        console.error("Error viewing data:", error);
    } finally {
        pool.end();
    }
}

viewData();
