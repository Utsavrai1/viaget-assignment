import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "@/constants/index";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/zustand/auth";

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  coverImage: string;
  desc: string;
  reviews?: Review[];
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

export const useBookRecommendation = (page: number, limit: number) => {
  return useQuery<PaginatedBooks, Error>({
    queryKey: ["recommendation", { page, limit }],
    placeholderData: (prev) => prev,
    queryFn: async () => {
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/book/all`, {
        params: { page, limit },
      });
      return data;
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
