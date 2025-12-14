import express from "express";
import multer from "multer";
import { createPost,getAllPosts, deletePost, toggleLike } from "../controllers/postController.js";
import { protect } from "../middleWare/authMiddleware.js";
import {upload} from "../middleWare/upload.js";

const router = express.Router();


// `photos` must match the field name from frontend FormData
router.post("/create",protect,upload.array("images",10), createPost);
router.get("/all",protect, getAllPosts);
router.delete("/delete/:id", protect, deletePost);
router.put("/like/:id", protect, toggleLike);

export default router;

