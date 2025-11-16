import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Start server
const PORT = process.env.PORT || 5000;
// const HOST = "127.0.0.1"; // avoids macOS AirPlay conflicts

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
