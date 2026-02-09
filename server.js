// ================= SERVER RESPONSIBILITIES WITH CODE ================= // This file shows EACH job of the server step‑by‑step.

// ===== 1️⃣ Install dependencies ===== // npm init -y // npm install express mysql2 cors
const express = require("express");
const app = express();
app.use(cors());
app.use(express.json());
const cors = require("cors");
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "mysql-28516d6c-vijaykumarbamini-8a07.c.aivencloud.com",
  port: 21961,
  user: "avnadmin",
  password: "AVNS_6IFWIK_Hopxn2pVBjkp",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: true
  }
});

db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }

  console.log("Connected to Aiven MySQL");

  const createTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text TEXT NOT NULL,
      sender VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTable, (err) => {
    if (err) console.error("Table creation error:", err);
    else console.log("✅ messages table ready");
  });
});
// ========================================================== // ===== 2️⃣ CONNECT TO DATABASE (Server ↔ MySQL) ====
// ========================================================== // ===== 3️⃣ RECEIVE INPUT FROM FRONTEND ==================== // ==========================================================

// POST /messages → frontend sends message here

app.post('/messages', (req, res) => {

// ===== 4️⃣ VALIDATE DATA ================================ const { text, sender } = req.body;

if (!text || text.trim() === '') { return res.status(400).json({ error: 'Message cannot be empty' }); }

if (text.length > 500) { return res.status(400).json({ error: 'Message too long' }); }

// ===== 5️⃣ STORE DATA IN DATABASE =======================

const sql = 'INSERT INTO messages (text, sender) VALUES (?, ?)';

db.query(sql, [text, sender || 'Anonymous'], (err, result) => { if (err) return res.status(500).json({ error: 'Database error' });

// ===== 6️⃣ SEND RESPONSE BACK TO FRONTEND =============

res.json({
  status: 'saved',
  id: result.insertId,
  text,
  sender: sender || 'Anonymous'
});

}); });

// ========================================================== // ===== 7️⃣ SEND OLD MESSAGES WHEN PAGE LOADS ============== // ==========================================================

// GET /messages → frontend calls this on refresh

app.get('/messages', (req, res) => {

const sql = 'SELECT * FROM messages ORDER BY created_at ASC';

db.query(sql, (err, results) => { if (err) return res.status(500).json({ error: 'Database error' });

res.json(results);

}); });

// ========================================================== // ===== 8️⃣ START THE SERVER ================================ // ==========================================================

const PORT =process.env.PORT || 3000;

app.listen(PORT, () => { console.log(🚀 Server running at http://localhost:${PORT}); });

// ========================================================== // ===== SUMMARY OF SERVER JOBS ============================= // ==========================================================

/*

1. Connect to database


2. Receive request from frontend


3. Validate data


4. Store message in MySQL


5. Send response back


6. Provide old messages on refresh


7. Run continuously waiting for requests */


                        
