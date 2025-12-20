import mongoose from "mongoose";

// Global cache (important for Vercel serverless)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    if (!process.env.MONGODB_URI && process.env.NODE_ENV !== "development") {
      throw new Error("❌ MONGODB_URI is not defined");
    }

    const uri =
      process.env.NODE_ENV === "development"
        ? "mongodb://127.0.0.1:27017/TalkTalkDB"
        : process.env.MONGODB_URI;

    cached.promise = mongoose.connect(uri, {
      dbName: "TalkTalkDB",

      // 🔥 THESE FIX THE VERCEL ERROR
      bufferCommands: false,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};
