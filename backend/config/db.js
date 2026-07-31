const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn("⚠️ MONGO_URI is missing; continuing in fallback auth mode for local development.");
      global.__govAssistAuthFallbackMode = true;
      return;
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    global.__govAssistAuthFallbackMode = true;
  }
};

module.exports = connectDB;