require("dotenv").config();
const PORT = process.env.PORT;
const AI_URL = process.env.AI_SERVICE_URL;
const express = require("express");
const cors = require("cors");
const auth=require("./middleware/authMiddleware");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running");
});
app.get("/api/test", (req, res) => {
  res.json({ message: "Hello from backend" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

const axios = require("axios");

app.get("/api/ai-test", async (req, res) => {
  try {
    const response = await axios.get("http://localhost:8000");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "AI service not reachable" });
  }
});
const bcrypt = require("bcryptjs");
const pool = require("./db");

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, hashedPassword]
    );

    res.json(newUser.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "User already exists or error occurred" });
  }
});
const jwt = require("jsonwebtoken");

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }
const token = jwt.sign(
  { 
    id: user.rows[0].id,
    role: user.rows[0].role || "student"
  },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
);
    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/api/dashboard", auth, (req, res) => {
  res.json({
    message: "Welcome to dashboard",
    userId: req.user.id
  });
});
const authMiddleware = require("./middleware/authMiddleware");

app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
const roleMiddleware = require("./middleware/roleMiddleware");

app.get(
  "/admin-data",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" });
  }
);