import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/constants/index";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand/auth";
import { toast } from "./use-toast";

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  coverImage: string;
  desc: string;
  userId: number;
  reviews?: Review[];
  likedBy?: Like[];
}

export interface Like {
  userId: number;
  bookId: number;
}

export interface PaginatedBooks {
  books: Book[];
  totalBooks: number;
  totalPages: number;
  currentPage: number;
}

export interface Review {
  id: number;
  rating: number;
  text: string;
  userId: number;
  user: {
    name: string;
  };
}

export interface AddBookForm {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  coverImageFile: File | null;
  desc: string;
}

export const useBooks = () => {
  return useQuery<Book[], Error>({
    queryKey: ["books"],
    queryFn: async () => {
      const token = useAuthStore.getState().token;

      const response = await axios.get(`${BACKEND_URL}/api/v1/book/mybook`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });
};

export const useBookRecommendation = (
  page: number,
  limit: number,
  options: {
    sortField?: string;
    sortOrder?: string;
    genres?: string[];
    searchQuery: string;
  }
) => {
  return useQuery<PaginatedBooks, Error>({
    queryKey: ["recommendation", { page, limit, ...options }],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const { sortField, sortOrder, genres, searchQuery } = options;
      const token = useAuthStore.getState().token;

      let response;
      if (token) {
        response = await axios.get(`${BACKEND_URL}/api/v1/book/all`, {
          params: {
            page,
            limit,
            sortField,
            sortOrder,
            genres: genres?.join(","),
            searchQuery,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await axios.get(`${BACKEND_URL}/api/v1/book/all`, {
          params: {
            page,
            limit,
            sortField,
            sortOrder,
            genres: genres?.join(","),
            searchQuery,
          },
        });
      }
      return response.data;
    },
    staleTime: 0,
  });
};

export const useBookDetails = (id: string) => {
  return useQuery<Book, Error>({
    queryKey: ["book", id],
    queryFn: async () => {
      const token = useAuthStore.getState().token;

      const response = await axios.get(
        `${BACKEND_URL}/api/v1/book/single/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    },
    enabled: !!id,
  });
};

export const useBookReview = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const reviewBook = async (rating: number, text: string, bookId: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const token = useAuthStore.getState().token;

      const data = {
        rating,
        text,
      };

      await axios.post(`${BACKEND_URL}/api/v1/book/review/${bookId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
    } catch (error) {
      setError("Failed to review book");
    } finally {
      setLoading(false);
    }

    if (success) {
      toast({
        title: "Review Successful",
        description: "Review Added Successfully",
      });
    }
  };

  return { reviewBook, loading, error, success };
};

export const useAddBookApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const addBook = async (form: AddBookForm) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("isbn", form.isbn);
    formData.append("genre", form.genre);
    formData.append("desc", form.desc);

    if (form.coverImageFile) {
      formData.append("coverImage", form.coverImageFile);
    }

    try {
      const token = useAuthStore.getState().token;

      await axios.post(`${BACKEND_URL}/api/v1/book/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess(true);
      navigate("/books");
    } catch (err) {
      setError("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  return { addBook, loading, error, success };
};

export const useGenres = () => {
  return useQuery<string[], Error>({
    queryKey: ["genres"],
    queryFn: async () => {
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/book/genres`);
      return data;
    },
    staleTime: Infinity,
  });
};

export const useLike = (id: string) => {
  const [liked, setLiked] = useState(false);
  const token = useAuthStore.getState().token;

  const handleLike = async () => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/book/like/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.error("Error liking book:", error);
      toast({
        title: "Error",
        description: "Something went wrong while liking the book",
      });
    }
  };

  return { liked, handleLike, setLiked };
};
