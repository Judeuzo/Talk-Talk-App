import { connectDB } from "../utils/db.js";
import { autoIncreaseViews } from "../controllers/postController.js";

export default async function handler(req, res) {
  try {

    await connectDB();
    await autoIncreaseViews();

    return res.status(200).json({
      success: true,
      message: "Views incremented successfully",
    });
  } catch (error) {
    console.error("Cron error:", error);
    return res.status(500).json({ success: false });
  }
}
