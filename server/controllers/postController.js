import Post from "../models/post.js";
import cloudinary from "cloudinary";
import AudioComment from "../models/audioComments.js";
import User from "../models/user.js";


//// CREATE POST

export const createPost = async (req, res) => {
  try {
    const caption = req.body?.caption?.trim() || "";
    const userId = req.userId;

    // Handle optional images
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    // ❌ Prevent completely empty posts
    if (!caption && uploadedImages.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Post must contain a caption or at least one image",
      });
    }

    // ⭐ Set expiration time (24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newPost = await Post.create({
      caption: caption || undefined, // avoid empty strings in DB
      images: uploadedImages,        // empty array is fine
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


// DELETE EXPIRED POSTS + CLOUDINARY IMAGES

export const deleteExpiredPosts = async () => {
  try {
    const expiredPosts = await Post.find({
      expiresAt: { $lte: new Date() }
    });

    for (const post of expiredPosts) {
      /* ======================================
         ⭐ 1. ADD POST VIEWS TO USER VIEWS
      ====================================== */
      if (post.user && post.views > 0) {
        await User.findByIdAndUpdate(
          post.user,
          { $inc: { views: post.views } }, // atomic increment
          { new: true }
        );
      }

      /* ======================================
         ⭐ 2. DELETE CLOUDINARY IMAGES
      ====================================== */
      for (const img of post.images) {
        if (img.public_id) {
          try {
            await cloudinary.v2.uploader.destroy(img.public_id);
          } catch (err) {
            console.error("Cloudinary delete error:", err);
          }
        }
      }

      /* ======================================
         ⭐ 3. DELETE POST
      ====================================== */
      await Post.findByIdAndDelete(post._id);
    }

  } catch (err) {
    console.error("Expired post cleanup error:", err);
  }
};

/// GET ALL POST
export const getAllPosts = async (req, res) => {
  try {
    // Clean expired posts before sending fresh data
    await deleteExpiredPosts();

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email avatar verified")
      .lean();

    // ⭐ Add timeLeft (ms remaining)
    posts.forEach((post) => {
      post.timeLeft = Math.max(
        new Date(post.expiresAt).getTime() - Date.now(),
        0
      );
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

/// DELETE SINGLE POST
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only owner can delete
    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    // Delete cloudinary images
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

    /* ======================================
        ⭐ DELETE ALL AUDIO COMMENTS FOR POST
    ====================================== */
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

    // delete from DB
    await AudioComment.deleteMany({ post: postId });

    // Finally delete post
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post and related audio comments deleted successfully",
    });

  } catch (err) {
    console.error("Delete post error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};


// AUTO-INCREMENT POST VIEWS EVERY MINUTE
export const autoIncreaseViews = async () => {
  try {
    const posts = await Post.find();

    for (const post of posts) {
      const randomIncrement = Math.floor(Math.random() * 9) + 1; // between 1–9
      post.views += randomIncrement;
      await post.save();
    }

  } catch (err) {
    console.error("Auto view increment error:", err);
  }
};

// RUN EVERY 1 MINUTE
setInterval(autoIncreaseViews, 60 * 1000);


// LIKE OR UNLIKE A POST
export const toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      // UNLIKE
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      await post.save();
      return res.json({
        success: true,
        message: "Post unliked",
        likes: post.likes.length,
      });
    } else {
      // LIKE
      post.likes.push(userId);
      await post.save();
      return res.json({
        success: true,
        message: "Post liked",
        likes: post.likes.length,
      });
    }
  } catch (err) {
    console.error("Like error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};
