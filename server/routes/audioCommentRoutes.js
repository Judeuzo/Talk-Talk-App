import express from "express";
import { getAllAudioComments, uploadAudioComment } from "../controllers/audioCommentController.js";
import { upload } from "../middleWare/audioUploadConfig.js";
import { protect } from "../middleWare/authMiddleware.js";

const router = express.Router();

router.post("/upload/:postId", protect, upload.single("audio"), uploadAudioComment);
router.get("/get/:postId", getAllAudioComments);

export default router;
