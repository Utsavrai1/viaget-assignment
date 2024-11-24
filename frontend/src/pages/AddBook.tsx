import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAddBookApi, AddBookForm } from "@/hooks/useBooks";
import { Textarea } from "@/components/ui/textarea";

const AddBook: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [isbn, setIsbn] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [desc, setDescription] = useState<string>("");

  const { addBook, loading, error, success } = useAddBookApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData: AddBookForm = {
      title,
      author,
      isbn,
      genre,
      coverImageFile: coverImage,
      desc,
    };

    await addBook(formData);
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Add New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="author">Author</Label>
          <Input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="genre">Genre</Label>
          <Input
            type="text"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={desc}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input
            type="file"
            id="coverImage"
            onChange={(e) =>
              setCoverImage(e.target.files ? e.target.files[0] : null)
            }
            accept="image/*"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {loading && <div>Loading...</div>}

        <Button type="submit" className="w-full" disabled={loading}>
          Add Book
        </Button>
      </form>

      {success && (
        <div className="text-green-500 mt-4">Book added successfully!</div>
      )}
    </div>
  );
};

export default AddBook;
