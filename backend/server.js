require("dotenv").config();
const PORT = process.env.PORT;
const AI_URL = process.env.AI_SERVICE_URL;
const express = require("express");
const cors = require("cors");

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