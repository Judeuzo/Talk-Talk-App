import mongoose from "mongoose";
import dotenv from "dotenv";
import { setAdminFromEnv } from "../controllers/adminController.js";
dotenv.config();

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGODB_URI,{
    dbName: "TalkTalkDB",
  }).then(() => {console.log("✅ MongoDB Connected Successfully")})
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

  isConnected = true;
};
