// server/cron/increaseViews.js
import Post from "../models/post.js";

export const increaseViews = async () => {
  const posts = await Post.find();

  for (const post of posts) {
    const randomIncrement = Math.floor(Math.random() * 99) + 1;
    post.views += randomIncrement;
    await post.save();
  }

  console.log("✅ Views increased");
};
