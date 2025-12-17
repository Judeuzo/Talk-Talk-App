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
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is not defined");
    }

    
    
    if(process.env.NODE_ENV=='development'){
      console.log('server is development')
      cached.promise = mongoose.connect('mongodb://localhost:27017/', {
      dbName: "TalkTalkDB",
    });
    }else{
      console.log('server is production')
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: "TalkTalkDB",
    });
    }
    
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB Connected Successfully");
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error("❌ MongoDB Connection Error:", error);
    throw error;
  }
};
