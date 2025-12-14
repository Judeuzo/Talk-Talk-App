import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: false,
      trim: true,
    },

    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      }
    ],

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Expiry Date
    expiresAt: {
      type: Date,
      required: true,
    },

    // Likes count
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Likes count
    audioComments: [{ type: mongoose.Schema.Types.ObjectId, ref: "AudioComment" }],

    // Views count
    views: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
