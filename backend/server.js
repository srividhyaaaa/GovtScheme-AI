const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// API Routes Placeholder Mounting
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/scholarships", require("./routes/scholarshipRoutes"));
app.use("/api/saved", require("./routes/savedRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));

// AI Routes (to be loaded in AI module)
try {
  app.use("/api/ai", require("./routes/aiRoutes"));
} catch (e) {
  // Gracefully fallback if route module is being built
}

// Admin Routes (to be loaded in Admin module)
try {
  app.use("/api/admin", require("./routes/adminRoutes"));
} catch (e) {
  // Gracefully fallback if route module is being built
}

// Default Health Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ScholarMatch AI Backend is Running 🚀",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      student: "/api/student",
      scholarships: "/api/scholarships",
      saved: "/api/saved",
      applications: "/api/applications",
      ai: "/api/ai",
      admin: "/api/admin",
    },
  });
});

// 404 Not Found Middleware
app.use(notFound);

// Global Custom Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

module.exports = app;