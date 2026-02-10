
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
  host: "mysql-28516d6c-vijaykumarbamini-8a07.c.aivencloud.com",
  port: 21961,
  user: "avnadmin",
  password: "AVNS_6IFWIK_Hopxn2pVBjkp",
  database: "defaultdb",
  ssl: {
    rejectUnauthorized: false
  }
});


db.connect(err => {
  if (err) {
    console.error("DB connection failed:", err);
    return;
  }

  console.log("✅ Connected to Aiven MySQL");

  const createTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text TEXT NOT NULL,
      sender VARCHAR(50) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  db.query(createTable, err => {
    if (err) console.error("Table creation error:", err);
    else console.log("✅ messages table ready");
  });
});

app.get("/", (req, res) => {
  res.send("Chat server is running");
});

app.get("/messages", (req, res) => {
  const sql = "SELECT * FROM messages ORDER BY created_at ASC";

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

app.post("/messages", (req, res) => {
  const { text, sender } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: "Message too long" });
  }

  const sql = "INSERT INTO messages (text, sender) VALUES (?, ?)";

  db.query(sql, [text, sender || "Anonymous"], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });

    res.json({
      status: "saved",
      id: result.insertId,
      text,
      sender: sender || "Anonymous"
    });
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
