import jwt from "jsonwebtoken";
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
    const { page, limit, sortField, sortOrder, genres, searchQuery } =
      req.query;
    const accessToken = req.headers.authorization?.split(" ")[1];
    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    let userId: number | null = null;

    if (accessToken) {
      try {
        const decodedToken: any = jwt.verify(
          accessToken,
          process.env.JWT_SECRET as string
        );
        userId = decodedToken.userId;
      } catch (error) {
        console.error("Invalid or expired token:", error);
        res.status(401).json({ error: "Invalid or expired token" });
        return;
      }
    }

    const baseWhereClause: any = {
      ...(genres && typeof genres === "string" && genres !== "all"
        ? { genre: { in: genres.split(",") } }
        : {}),
      ...(searchQuery
        ? {
            OR: [
              { title: { contains: searchQuery, mode: "insensitive" } },
              { author: { contains: searchQuery, mode: "insensitive" } },
              { isbn: { contains: searchQuery, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    let recommendedBooks: any[] = [];
    let otherBooks = [];

    if (userId) {
      const likedBooks = await prisma.book.findMany({
        where: {
          likedBy: {
            some: {
              userId,
            },
          },
        },
        select: {
          genre: true,
          author: true,
        },
      });

      const likedGenres = [...new Set(likedBooks.map((book) => book.genre))];
      const likedAuthors = [...new Set(likedBooks.map((book) => book.author))];

      if (likedGenres.length > 0 || likedAuthors.length > 0) {
        recommendedBooks = await prisma.book.findMany({
          where: {
            AND: [
              {
                OR: [
                  { genre: { in: likedGenres } },
                  { author: { in: likedAuthors } },
                ],
              },
              baseWhereClause,
            ],
          },
          include: {
            reviews: true,
          },
          orderBy:
            sortField && sortOrder
              ? { [sortField as string]: sortOrder }
              : undefined,
        });
      }

      const recommendedBookIds = recommendedBooks.map((book) => book.id);
      baseWhereClause.id = { notIn: recommendedBookIds };
    }

    otherBooks = await prisma.book.findMany({
      where: baseWhereClause,
      include: {
        reviews: true,
      },
      orderBy:
        sortField && sortOrder
          ? { [sortField as string]: sortOrder }
          : undefined,
    });

    otherBooks = otherBooks.sort(() => Math.random() - 0.5);

    const allBooks = [...recommendedBooks, ...otherBooks];

    const paginatedBooks = allBooks.slice(
      (pageNumber - 1) * limitNumber,
      pageNumber * limitNumber
    );

    res.status(200).json({
      books: paginatedBooks,
      totalPages: Math.ceil(allBooks.length / limitNumber),
    });
  } catch (error) {
    console.error("Error fetching books:", error);
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
        likedBy: true,
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
  const { rating, text } = req.body;
  const userId = (req as any).userId;

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

const getGenres = async (req: Request, res: Response) => {
  try {
    const genres = await prisma.book.findMany({
      select: { genre: true },
      distinct: ["genre"],
    });

    const genreList = genres.map((book) => book.genre);

    res.status(200).json(genreList);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
};

const likeBook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId: parseInt(id),
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_bookId: {
            userId,
            bookId: parseInt(id),
          },
        },
      });
      res.status(200).json({ message: "Book unliked successfully" });
      return;
    } else {
      await prisma.like.create({
        data: {
          userId,
          bookId: parseInt(id),
        },
      });
      res.status(200).json({ message: "Book liked successfully" });
      return;
    }
  } catch (error) {
    console.error("Error liking book:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const getBookLikeOfUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).userId;

  try {
    const like = await prisma.like.findUnique({
      where: {
        userId_bookId: {
          userId: userId,
          bookId: parseInt(id),
        },
      },
    });

    res.json({ liked: like !== null });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  getCurrentUserBooks,
  getAllBooks,
  getBookById,
  addBook,
  addReview,
  getGenres,
  likeBook,
  getBookLikeOfUser,
};
