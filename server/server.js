import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import audioCommentsRoutes from "./routes/audioCommentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

import { connectDB } from "./utils/db.js";
import { setAdminFromEnv } from "./controllers/adminController.js";

// Load env in development
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: process.cwd() + "/.env" });
}

const app = express();

// =======================
// Middleware
// =======================
app.use(cors());
app.use(express.json());

// =======================
// MongoDB + Admin bootstrap
// =======================
let adminInitialized = false;

const initServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is missing in environment variables");
    }

    // Connect to MongoDB once
    await connectDB();

    // Ensure admin setup runs once
    if (!adminInitialized) {
      await setAdminFromEnv();
      adminInitialized = true;
    }

    console.log("✅ MongoDB connected and admin initialized");
  } catch (err) {
    console.error("❌ Server initialization error:", err);
    if (process.env.NODE_ENV !== "production") process.exit(1);
  }
};

// Run initialization only in development (for local server)
if (process.env.NODE_ENV !== "production") {
  initServer().then(() => {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  });
} else {
  // In production (Vercel), just init DB/admin without listening
  initServer();
}

// =======================
// Routes
// =======================
app.get("/", (req, res) => {
  res.send("✅ Server is live");
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/audioComment", audioCommentsRoutes);
app.use("/api/admin", adminRouter);

// =======================
// Export for Vercel
// =======================
export default app;
