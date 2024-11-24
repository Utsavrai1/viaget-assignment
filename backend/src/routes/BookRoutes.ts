import express from "express";
import {
  getCurrentUserBooks,
  getAllBooks,
  getBookById,
  addBook,
  addReview,
  getGenres,
  likeBook,
} from "../controllers/BookControllers";
import upload from "../middleware/upload";
import { authenticateToken } from "../middleware/AuthMiddleWare";

const router = express.Router();

router.get("/mybook", authenticateToken, getCurrentUserBooks);
router.get("/all", getAllBooks);
router.get("/genres", getGenres);
router.get("/single/:id", getBookById);
router.post("/add", authenticateToken, upload.single("coverImage"), addBook);
router.post("/review/:id", authenticateToken, addReview);
router.post("/like/:id", authenticateToken, likeBook);
router.get("/like/:id", authenticateToken, likeBook);

export default router;
