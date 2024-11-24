import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useBookDetails, useBookReview, useLike } from "@/hooks/useBooks";
import { ReviewCard } from "@/components/ReviewCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "react-custom-rating-component";
import { useAuthStore } from "@/zustand/auth";

import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

const BookDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error } = useBookDetails(id || "");
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const { reviewBook, loading: postingReview } = useBookReview();
  const { getUserId } = useAuthStore();

  const userId = getUserId();

  const [hasRated, setHasRated] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const { liked, handleLike, setLiked } = useLike(id || "");
  const [totalLikes, setTotalLikes] = useState(0);

  useEffect(() => {
    if (book && userId) {
      const userReview = book.reviews?.find(
        (review) => review.userId === userId
      );
      setHasRated(!!userReview);
      setIsAuthor(book.userId === userId);
      const hasUserLiked = book.likedBy?.some((like) => like.userId === userId);
      if (hasUserLiked) {
        setLiked(hasUserLiked);
      }
      setTotalLikes(book.likedBy?.length || 0);
    }
  }, [book, userId, setLiked]);

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewText(e.target.value);
  };

  const handleSubmitReview = async () => {
    if (reviewText && rating > 0 && id) {
      await reviewBook(rating, reviewText, id);
      setReviewText("");
      setRating(0);
      window.location.reload();
    }
  };

  const handleLikeClicked = async () => {
    if (liked) {
      setTotalLikes((prev) => prev - 1);
    } else {
      setTotalLikes((prev) => prev + 1);
    }
    await handleLike();
  };

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
          <div className="flex gap-4 mt-4">
            <Button
              onClick={handleLikeClicked}
              variant="outline"
              className={`p-2 rounded-full ${
                liked ? "text-red-500" : "text-gray-500"
              }`}
            >
              {liked ? <AiFillHeart size={34} /> : <AiOutlineHeart size={34} />}
              <p className="text-lg font-semibold text-gray-600">
                {totalLikes} Likes
              </p>
            </Button>
          </div>

          {book.reviews?.length !== 0 && (
            <h3 className="text-2xl font-bold mt-8 mb-4">Reviews</h3>
          )}
          {book.reviews?.map((review) => (
            <ReviewCard key={review.id} {...review} />
          ))}

          {hasRated ? (
            <p className="text-xl font-semibold text-gray-600 mt-8"></p>
          ) : isAuthor ? (
            <p className="text-center text-xl font-semibold text-gray-600 mt-8">
              You cannot rate your own book
            </p>
          ) : (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4">Add a Review</h3>

              <Rating
                defaultValue={0}
                size="30px"
                spacing="5px"
                activeColor="yellow"
                precision={1}
                onChange={setRating}
              />

              <Textarea
                value={reviewText}
                onChange={handleReviewChange}
                placeholder="Write your review..."
                rows={4}
                className="mt-4 mb-4"
              />
              <Button onClick={handleSubmitReview} disabled={postingReview}>
                Submit Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BookDetails;
