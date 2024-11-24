import { Review } from "@/hooks/useBooks";

export const calculateAverageRating = (reviews: Review[] = []): number => {
  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRating / reviews.length;
};
