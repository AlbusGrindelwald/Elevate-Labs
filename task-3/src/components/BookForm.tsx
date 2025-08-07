import { useState, useEffect } from "react";
import { Book, CreateBookRequest } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface BookFormProps {
  book?: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBookRequest) => void;
}

const genres = [
  "Fiction",
  "Non-Fiction",
  "Mystery",
  "Romance",
  "Science Fiction",
  "Fantasy",
  "Biography",
  "History",
  "Self-Help",
  "Poetry",
  "Drama",
  "Horror",
  "Adventure",
  "Comedy",
  "Dystopian Fiction"
];

export function BookForm({ book, isOpen, onClose, onSubmit }: BookFormProps) {
  const [formData, setFormData] = useState<CreateBookRequest>({
    title: "",
    author: "",
    isbn: "",
    publication_year: undefined,
    genre: "",
    description: "",
    cover_url: ""
  });

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        isbn: book.isbn || "",
        publication_year: book.publication_year,
        genre: book.genre || "",
        description: book.description || "",
        cover_url: book.cover_url || ""
      });
    } else {
      setFormData({
        title: "",
        author: "",
        isbn: "",
        publication_year: undefined,
        genre: "",
        description: "",
        cover_url: ""
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (field: keyof CreateBookRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value === "" ? undefined : value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-subtle">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
            {book ? "Edit Book" : "Add New Book"}
          </DialogTitle>
          <DialogDescription>
            {book ? "Update the book information below." : "Fill in the details to add a new book to your library."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
                className="focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author" className="text-sm font-medium">
                Author *
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => handleChange("author", e.target.value)}
                required
                className="focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn" className="text-sm font-medium">
                ISBN
              </Label>
              <Input
                id="isbn"
                value={formData.isbn}
                onChange={(e) => handleChange("isbn", e.target.value)}
                placeholder="978-0-123456-78-9"
                className="focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="publication_year" className="text-sm font-medium">
                Publication Year
              </Label>
              <Input
                id="publication_year"
                type="number"
                value={formData.publication_year || ""}
                onChange={(e) => handleChange("publication_year", parseInt(e.target.value))}
                min="1000"
                max={new Date().getFullYear()}
                className="focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm font-medium">
              Genre
            </Label>
            <Select value={formData.genre} onValueChange={(value) => handleChange("genre", value)}>
              <SelectTrigger className="focus:ring-primary">
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Brief description of the book..."
              className="focus:ring-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_url" className="text-sm font-medium">
              Cover Image URL
            </Label>
            <Input
              id="cover_url"
              type="url"
              value={formData.cover_url}
              onChange={(e) => handleChange("cover_url", e.target.value)}
              placeholder="https://example.com/cover.jpg"
              className="focus:ring-primary"
            />
          </div>

          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary text-primary-foreground hover:opacity-90">
              {book ? "Update Book" : "Add Book"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}