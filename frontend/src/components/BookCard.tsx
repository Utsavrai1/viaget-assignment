import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import { Badge } from "@/components/ui/badge";
import { Book } from "@/hooks/useBooks";
import { calculateAverageRating } from "@/lib/averageRating";

type BookCardProps = Pick<
  Book,
  "id" | "title" | "author" | "coverImage" | "reviews"
>;

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
  reviews = [],
}) => {
  const averageRating = calculateAverageRating(reviews);

  return (
    <Card className="overflow-hidden">
      <img src={coverImage} alt={title} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{author}</p>

        <div className="flex items-center space-x-2 mt-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`${
                  index < averageRating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <Badge variant="outline" className="text-sm">
            {averageRating.toFixed(1)}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/books/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
