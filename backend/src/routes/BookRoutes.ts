import express from "express";
import {
  getCurrentUserBooks,
  getAllBooks,
  getBookById,
  addBook,
  addReview,
} from "../controllers/BookControllers";
import upload from "../middleware/upload";
import { authenticateToken } from "../middleware/AuthMiddleWare";

const router = express.Router();

router.get("/mybook", authenticateToken, getCurrentUserBooks);
router.get("/all", getAllBooks);
router.get("/single/:id", getBookById);
router.post("/add", authenticateToken, upload.single("coverImage"), addBook);
router.get("/review/:id", authenticateToken, addReview);

export default router;
