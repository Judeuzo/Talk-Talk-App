import { autoIncreaseViews } from "../controllers/postController.js";
import { connectDB } from "../utils/db.js";

export default async function handler(req, res) {
  try {
    await connectDB(); // ensure DB is connected
    await autoIncreaseViews();
    res.status(200).json({ success: true, message: "Post views updated" });
  } catch (err) {
    console.error("Auto increase views error:", err);
    res.status(500).json({ success: false, message: "Failed to update views" });
  }
}
