import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import audioCommentsRoutes from "./routes/audioCommentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

import { connectDB } from "./utils/db.js";
import { setAdminFromEnv } from "./controllers/adminController.js";
import { increaseViews } from "./cron/increaseViews.js";

// Load env locally
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
// Lazy DB + Admin Init (SAFE FOR VERCEL)
// =======================
let initialized = false;

app.use(async (req, res, next) => {
  if (!initialized) {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error("❌ MONGODB_URI missing");
      }

      await connectDB();
      await setAdminFromEnv();

      initialized = true;
      console.log("✅ DB connected & admin ready");
    } catch (err) {
      console.error("❌ Initialization error:", err);
      return res.status(500).json({ success: false, message: "Server init failed" });
    }
  }
  next();
});

// =======================
// Routes
// =======================
app.get("/", (req, res) => {
  res.send("✅ Server is live");
});

app.post("/cron/increaseViews", async (req, res) => {
  try {
    await increaseViews();
    res.json({
      success: true,
      message: "Views incremented successfully",
    });
  } catch (err) {
    console.error("Increase views error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to increase views",
    });
  }
});

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/audioComment", audioCommentsRoutes);
app.use("/api/admin", adminRouter);

// =======================
// Local dev only
// =======================
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

// =======================
// Export for Vercel
// =======================
export default app;
