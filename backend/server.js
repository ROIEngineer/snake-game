// Server configuration
const express = require("express");
const app = express();
const PORT = 3000;

const cors = require("cors");

// Middleware
app.use(express.json());
app.use(cors());

// Temporary in-memory storage
let scores = [];

// Test route
app.get("/", (req, res) => {
  res.send("Snake Game Backend is running.");
});

// Get all scores
app.get("/scores", (req, res) => {
  res.json(scores);
});

// Post a new score
app.post("/scores", (req, res) => {
  const { score } = req.body;

  if (typeof score !== "number") {
    return res.status(400).json({ error: "Score must be a number" });
  }

  scores.push({
    score,
    createdAt: new Date()
  });

  res.status(201).json({ message: "Score saved" });
});

// Server: ON
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
