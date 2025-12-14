import { connectDB } from "../../utils/db.js";
import Post from "../../models/post.js";

export default async function handler(req, res) {
  await connectDB();

  const posts = await Post.find();
  for (const post of posts) {
    post.views += Math.floor(Math.random() * 9) + 1;
    await post.save();
  }

  res.json({ success: true });
}
