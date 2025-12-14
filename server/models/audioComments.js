import mongoose from "mongoose";

const audioCommentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    audio: {
      url: { type: String, required: true },        // Cloudinary URL
      public_id: { type: String, required: true },  // Cloudinary public_id
    },

    duration: {
      type: String, // "6:13"
      required: true,
    },

    text: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AudioComment", audioCommentSchema);
