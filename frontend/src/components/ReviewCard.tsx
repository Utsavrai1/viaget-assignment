import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Review } from "@/hooks/useBooks";

export const ReviewCard: React.FC<Review> = ({ rating, text, user }) => {
  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{user.name}</CardTitle>
          <Badge variant="secondary">Rating: {rating}/5</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p>{text}</p>
      </CardContent>
    </Card>
  );
};
