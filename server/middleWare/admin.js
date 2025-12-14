import User from "../models/user.js";

export const adminMiddleware = async (req, res, next) => {
  try {
    // Make sure req.user exists and has an id
    if (!req.userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Fetch the user from DB
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if user is admin
    if (!user.admin) {
      return res.status(403).json({ success: false, message: "Admin access only" });
    }

    // Attach the full user object to the request in case needed later
    req.user = user;
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
