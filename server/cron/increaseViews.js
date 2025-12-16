import { autoIncreaseViews } from "../controllers/postController.js";
import { connectDB } from "../utils/db.js";

export default async function handler(req, res) {
  try {
    // Allow GET or POST (easier for testing)
    await connectDB();
    await autoIncreaseViews();

    return res.status(200).json({
      success: true,
      message: "Views incremented successfully",
    });
  } catch (error) {
    console.error("Increase views cron error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to increase views",
    });
  }
}
