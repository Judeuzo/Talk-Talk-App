import express from "express";
import { deleteUserAndPosts, toggleUserVerification } from "../controllers/adminController.js";
import { protect } from "../middleWare/authMiddleware.js";
import { adminMiddleware } from "../middleware/admin.js";

const adminRouter = express.Router();

adminRouter.delete(
  "/delete-user/:id",
  protect,
  adminMiddleware,
  deleteUserAndPosts
);
adminRouter.put(
  "/verify-user/:id",
  protect,
  adminMiddleware,
  toggleUserVerification
);

export default adminRouter;
