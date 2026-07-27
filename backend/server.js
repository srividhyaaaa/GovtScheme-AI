const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Connect Database
const connectDB = require("./config/db");
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming request route for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/saved", require("./routes/savedRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// Default Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ScholarMatch AI / GovtScheme-AI Backend is Running 🚀",
    endpoints: {
      auth: "/api/auth",
      student: "/api/student",
      scholarships: "/api/scholarships",
      saved: "/api/saved",
      applications: "/api/applications",
    },
  });
});

// Handle Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;