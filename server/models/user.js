import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    avatar: { type: String, default: "" } // Cloudinary URL
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
