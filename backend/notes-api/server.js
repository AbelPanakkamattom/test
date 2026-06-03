// 1. Setup Environment
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5500;

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Database Configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: parseInt(process.env.DB_PORT || "5432"),
});

// Verify Connection
pool.connect((err, client, done) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Successfully connected to PostgreSQL database!");
    done();
  }
});

// 4. Routes
app.get("/notes", async (req, res) => {
  const { search } = req.query;
  try {
    let query = "SELECT * FROM notes ORDER BY updated_at DESC";
    let params = [];

    if (search) {
      query = "SELECT * FROM notes WHERE title ILIKE $1 OR content ILIKE $1 ORDER BY updated_at DESC";
      params = [`%${search}%`];
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Database error: " + err.message });
  }
});

// Other CRUD operations
app.post("/notes", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query("INSERT INTO notes (title, content, user_id) VALUES ($1, $2, 1) RETURNING *", [title, content || ""]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  try {
    const result = await pool.query("UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *", [title, content, req.params.id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM notes WHERE id = $1", [req.params.id]);
    res.status(200).json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Start Server
app.listen(PORT, () => {
  console.log(`Backend API running at http://localhost:${PORT}`);
});