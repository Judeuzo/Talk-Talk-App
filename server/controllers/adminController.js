import User from "../models/user.js";
import Post from "../models/post.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";


dotenv.config();

/**
 * DELETE USER + ALL THEIR POSTS (ADMIN ONLY)
 */
export const deleteUserAndPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    // 1️⃣ Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2️⃣ Find all posts by this user
    const posts = await Post.find({ user: userId });

    // 3️⃣ Delete all Cloudinary images for those posts
    for (const post of posts) {
      if (post.images && post.images.length > 0) {
        for (const img of post.images) {
          if (img.public_id) {
            try {
              await cloudinary.v2.uploader.destroy(img.public_id);
            } catch (err) {
              console.error("Cloudinary delete error:", err);
            }
          }
        }
      }
    }

    // 4️⃣ Delete all posts by user
    await Post.deleteMany({ user: userId });

    // 5️⃣ Delete the user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User and all their posts deleted successfully",
    });

  } catch (err) {
    console.error("Admin delete user error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};


/// MAKE ADMIN

export const setAdminFromEnv = async () => {
  try {
    const adminEmail=process.env.ADMIN;

    if (!adminEmail) {
      console.log("ADMIN_EMAIL not set in environment variables")
    }

    const user = await User.findOne({ email: adminEmail });

    if (!user) {
        console.log("User with ADMIN_EMAIL not found")
    }

    if (user.admin) {
        return console.log("User already set as Admin")
    }

    user.admin = true;
    await user.save();

    return  console.log("Admin privileges granted")
    
  } catch (err) {
    console.error("Set admin error:", err);
    return console.log("Failed to set admin")
  }
};


// Verify or unverify a user
export const toggleUserVerification = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Toggle verification status
    user.verified = !user.verified;
    await user.save();

    return res.status(200).json({
      message: `User has been ${user.verified ? "verified" : "unverified"} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Error toggling user verification:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



