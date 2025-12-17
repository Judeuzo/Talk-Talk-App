import Post from "../models/post.js";
import User from "../models/user.js";
import cloudinary from "cloudinary";
import AudioComment from "../models/audioComments.js";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: process.cwd() + "/.env" });
}

// ===========================
// CREATE POST
// ===========================
export const createPost = async (req, res) => {
  try {
    const caption = req.body?.caption?.trim() || "";
    const userId = req.userId;

    const uploadedImages = (req.files || []).map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    if (!caption && uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post must contain a caption or at least one image",
      });
    }

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newPost = await Post.create({
      caption: caption || undefined,
      images: uploadedImages,
      user: userId,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (err) {
    console.error("Create post error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create post, please try again",
    });
  }
};

// ===========================
// DELETE EXPIRED POSTS + UPDATE USER VIEWS
// ===========================
export const deleteExpiredPosts = async () => {
  try {
    const expiredPosts = await Post.find({ expiresAt: { $lte: new Date() } });

    for (const post of expiredPosts) {
      if (post.user && post.views > 0) {
        await User.findByIdAndUpdate(post.user, {
          $inc: { views: post.views },
        });
      }

      for (const img of post.images) {
        if (img.public_id) {
          try {
            await cloudinary.v2.uploader.destroy(img.public_id);
          } catch (err) {
            console.error("Cloudinary delete error:", err);
          }
        }
      }

      const audioComments = await AudioComment.find({ post: post._id });
      for (const audio of audioComments) {
        if (audio.public_id) {
          try {
            await cloudinary.v2.uploader.destroy(audio.public_id);
          } catch (err) {
            console.error("Cloudinary audio delete error:", err);
          }
        }
      }
      await AudioComment.deleteMany({ post: post._id });

      await Post.findByIdAndDelete(post._id);
    }
  } catch (err) {
    console.error("Expired post cleanup error:", err);
  }
};

// ===========================
// GET ALL POSTS
// ===========================
export const getAllPosts = async (req, res) => {
  try {
    await deleteExpiredPosts();
    await autoIncreaseViews();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email avatar verified")
      .lean();

    posts.forEach((post) => {
      post.timeLeft = Math.max(new Date(post.expiresAt).getTime() - Date.now(), 0);
    });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (err) {
    console.error("Get all posts error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
    });
  }
};

// ===========================
// DELETE SINGLE POST
// ===========================
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ success: false, message: "Post not found" });

    if (post.user.toString() !== userId)
      return res.status(403).json({ success: false, message: "Not allowed" });

    for (const img of post.images || []) {
      if (img.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(img.public_id);
        } catch (err) {
          console.error("Cloudinary delete error:", err);
        }
      }
    }

    const audioComments = await AudioComment.find({ post: postId });
    for (const audio of audioComments) {
      if (audio.public_id) {
        try {
          await cloudinary.v2.uploader.destroy(audio.public_id);
        } catch (err) {
          console.error("Cloudinary audio delete error:", err);
        }
      }
    }
    await AudioComment.deleteMany({ post: postId });

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post and related audio deleted",
    });
  } catch (err) {
    console.error("Delete post error:", err);
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
};

// ===========================
// AUTO-INCREMENT POST VIEWS (Development only)
// ===========================
export const autoIncreaseViews = async () => {
  try {
    const posts = await Post.find();
    for (const post of posts) {
      const randomIncrement = Math.floor(Math.random() * 99) + 1;
      post.views += randomIncrement;
      await post.save();
    }
  } catch (err) {
    console.error("Auto view increment error:", err);
  }
};

// Run interval only in development
if (process.env.NODE_ENV === "development") {
  setInterval(autoIncreaseViews, 60 * 1000);
}

// ===========================
// LIKE / UNLIKE POST
// ===========================
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({ success: true, message: "Post unliked", likes: post.likes.length });
    } else {
      post.likes.push(userId);
      await post.save();
      return res.json({ success: true, message: "Post liked", likes: post.likes.length });
    }
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ success: false, message: "Failed to update like" });
  }
};
