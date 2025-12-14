import AudioComment from "../models/audioComments.js";

/// UPLOAD AUDIO CONTROLLER

export const uploadAudioComment = async (req, res) => {
    try {
        const { postId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No audio file uploaded" });
        }

        // Cloudinary result is already in req.file.path or req.file.url depending on config
        const audioUrl = req.file.path || req.file.url;
        const publicId = req.file.filename

        const audioComment = await AudioComment.create({
            post:postId,
            user: req.userId,
            audio:{url:audioUrl,public_id:publicId},
            duration: req.body.duration || null,
        });

        res.status(201).json({
            message: "Audio comment uploaded successfully",
            audioComment,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error uploading audio comment" });
    }
};


// GET ALL AUDIO COMMENTS FOR POST

export const getAllAudioComments = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const comments = await AudioComment.find({ post: postId })
      .populate("user", "name avatar") // populate user info
      .sort({ createdAt: -1 });       // newest first

    res.status(200).json({ success: true, comments });
  } catch (err) {
    console.error("Error fetching audio comments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
