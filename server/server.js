import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import audioCommentsRoutes from "./routes/audioCommentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

import { connectDB } from "./utils/db.js";
import { setAdminFromEnv } from "./controllers/adminController.js";

// Load environment variables in development
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

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ MONGODB_URI is missing in environment variables");
    }

    // Connect to MongoDB once at startup
    await connectDB();

    // Ensure admin exists (runs once)
    if (!adminInitialized) {
      await setAdminFromEnv();
      adminInitialized = true;
    }

    // =======================
    // Routes
    // =======================
    app.use("/api/user", userRoutes);
    app.use("/api/post", postRoutes);
    app.use("/api/audioComment", audioCommentsRoutes);
    app.use("/api/admin", adminRouter);

    app.get("/api", (req, res) => {
      res.send("✅ Server is live");
    });

    // =======================
    // Local development listener
    // =======================
    if (process.env.NODE_ENV !== "production") {
      const PORT = process.env.PORT || 8080;
      app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
      });
    }
  } catch (err) {
    console.error("❌ Server startup error:", err);
    process.exit(1); // stop server if DB fails to connect
  }
};

// Start server (dev) or let Vercel import app
startServer();

// =======================
// Export for Vercel
// =======================
export default app;
