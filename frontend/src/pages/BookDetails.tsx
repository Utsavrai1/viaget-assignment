import React from "react";
import { useParams } from "react-router-dom";
import { useBookDetails } from "@/hooks/useBooks";
import { ReviewCard } from "@/components/ReviewCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error } = useBookDetails(id || "");

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error occurred</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-8">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full md:w-1/3 h-64 object-cover rounded-lg shadow-lg"
            />
            <div>
              <CardTitle className="text-3xl mb-2">{book.title}</CardTitle>
              <CardDescription className="text-xl mb-4">
                by {book.author}
              </CardDescription>
              <p>
                <strong>ISBN:</strong> {book.isbn}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre}
              </p>
              <p>{book.desc}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {book.reviews?.length !== 0 && (
            <h3 className="text-2xl font-bold mt-8 mb-4">Reviews</h3>
          )}
          {book.reviews?.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetails;
