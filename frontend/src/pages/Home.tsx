import React, { useState } from "react";
import { BookCard } from "@/components/BookCard";
import { useBookRecommendation } from "@/hooks/useBooks";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

const Home: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const limit = 4;

  const { data: booksData, isLoading } = useBookRecommendation(page, limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to the Book Management App
      </h1>
      <p className="text-xl text-center">
        Discover, review, and share your favorite books!
      </p>
      <h2 className="text-start text-2xl font-bold mb-4 mt-6">
        Recommendations
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {booksData?.books?.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: booksData?.totalPages || 0 }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  className={page === index + 1 ? "bg-blue-500 text-white" : ""}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Home;
