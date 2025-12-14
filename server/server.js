import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import audioCommentsRoutes from "./routes/audioCommentRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import { setAdminFromEnv } from "./controllers/adminController.js";

dotenv.config();
const app=express()
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGODB_URI;
app.use(cors());
app.use(express.json());



// Routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/audioComment", audioCommentsRoutes);
app.use("/api/admin", adminRouter);

// MongoDB Connection
mongoose.connect(MONGO_URI, {
    dbName: "TalkTalkDB",
  }).then(() => {console.log("✅ MongoDB Connected Successfully");setAdminFromEnv()})
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));


app.get("/api",(req,res)=>{
    res.send("server is live")
})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});