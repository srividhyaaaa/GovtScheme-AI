const mongoose = require("mongoose");

const connectDB = async () => {
  try {
<<<<<<< HEAD
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.warn("⚠️ MONGO_URI is missing; continuing in fallback auth mode for local development.");
      global.__govAssistAuthFallbackMode = true;
      return;
=======
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scholarmatch";
    if (!process.env.MONGO_URI) {
      console.warn("⚠️ MONGO_URI missing from environment. Falling back to local MongoDB: mongodb://127.0.0.1:27017/scholarmatch");
>>>>>>> a461639 (Fix user registration flow, backend validation responses, and error handling)
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    global.__govAssistAuthFallbackMode = true;
  }
};

module.exports = connectDB;