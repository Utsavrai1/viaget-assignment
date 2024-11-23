import cloudinary from "../utils/cloudinary";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCurrentUserBooks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: "User ID is missing" });
      return;
    }

    console.log(userId);

    const userBooks = await prisma.book.findMany({
      where: {
        userId: userId,
      },
      include: {
        reviews: true,
      },
    });

    res.json(userBooks);
  } catch (error) {
    console.error("Error fetching current user's books:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllBooks = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const books = await prisma.book.findMany({
      skip,
      take: limit,
    });

    const totalBooks = await prisma.book.count();

    res.json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

const getBookById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviews: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Something Went Wrong" });
  }
};

const addBook = async (req: Request, res: Response) => {
  const { title, author, isbn, genre, desc } = req.body;
  const file = req.file;

  const userId = (req as any).userId;

  try {
    let coverImageUrl = "";
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "books",
      });
      coverImageUrl = result.secure_url;
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        genre,
        coverImage: coverImageUrl,
        desc,
        userId,
      },
    });

    res.json(book);
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

const addReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rating, text, userId } = req.body;

  try {
    const review = await prisma.review.create({
      data: {
        rating,
        text,
        user: { connect: { id: userId } },
        book: { connect: { id: parseInt(id) } },
      },
    });
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: "Failed to create review" });
  }
};

export { getCurrentUserBooks, getAllBooks, getBookById, addBook, addReview };
