import React, { useState } from "react";
import { useGenres, useBookRecommendation } from "@/hooks/useBooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { BookCard } from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import { search404 } from "@/assets";

const Home: React.FC = () => {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedSortField, setSelectedSortField] = useState<string>("title");
  const [selectedSortOrder, setSelectedSortOrder] = useState<string>("asc");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const limit = 4;

  const { data: genres, isLoading: genresLoading } = useGenres();
  const { data: booksData, isLoading: booksLoading } = useBookRecommendation(
    page,
    limit,
    {
      genres: selectedGenre ? [selectedGenre] : [],
      sortField: selectedSortField,
      sortOrder: selectedSortOrder,
      searchQuery,
    }
  );

  const handleGenreChange = (value: string) => {
    setSelectedGenre(value === "all" ? null : value);
    setPage(1);
  };

  const handleSortFieldChange = (value: string) => {
    setSelectedSortField(value);
    setPage(1);
  };

  const handleSortOrderChange = (value: string) => {
    setSelectedSortOrder(value);
    setPage(1);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  if (genresLoading || booksLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4 text-center">
        Welcome to the BookHive
      </h1>
      <p className="text-xl text-center">
        Discover, review, and share your favorite books!
      </p>

      <div className="mt-4 flex justify-center space-x-4 flex-wrap ">
        <div className="relative w-full sm:w-[400px] md:w-[500px] mb-4">
          <Input
            type="text"
            placeholder={`Search by Name, ISBN or Author`}
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>

        <Select
          onValueChange={handleGenreChange}
          value={selectedGenre || "all"}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter by Genre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres?.map((genre) => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={handleSortFieldChange} value={selectedSortField}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="desc">Description</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={handleSortOrderChange} value={selectedSortOrder}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h2 className="text-start text-2xl font-bold mb-4 mt-6">
        Recommendations
      </h2>
      <div className="flex items-center justify-center w-full">
        {booksData?.books.length === 0 && (
          <div>
            <img src={search404} alt="No Result" className="w-96" />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {booksData?.books?.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
            reviews={book.reviews}
          />
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: booksData?.totalPages || 0 }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setPage(index + 1)}
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
