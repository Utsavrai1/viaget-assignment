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
import { Book } from "@/hooks/useBooks";

type BookCardProps = Pick<Book, "id" | "title" | "author" | "coverImage">;

export const BookCard: React.FC<BookCardProps> = ({
  id,
  title,
  author,
  coverImage,
}) => {
  return (
    <Card className="overflow-hidden">
      <img src={coverImage} alt={title} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{author}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/books/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
