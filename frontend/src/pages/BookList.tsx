import React from "react";
import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/BookCard";

const BookList: React.FC = () => {
  const { data: books, isLoading, error } = useBooks();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;
  if (books?.length === 0)
    return (
      <div>You haven't added any books yet. Start by adding a new book!</div>
    );

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Book List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books?.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
          />
        ))}
      </div>
    </div>
  );
};

export default BookList;
