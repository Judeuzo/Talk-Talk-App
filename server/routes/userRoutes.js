import express from "express";
import {
  register,
  login,
  updateProfile,
  getAllUsers,
} from "../controllers/UserController.js";

import { protect } from "../middleWare/authMiddleware.js";
import {upload} from "../middleWare/upload.js";

const router = express.Router();

/* ========================
   AUTH ROUTES
========================= */
router.post("/register", register);
router.post("/login", login);
router.get("/all", getAllUsers);

/* ========================
   USER ROUTES
========================= */
router.put("/update",protect, upload.single("avatar"), updateProfile);

export default router;
