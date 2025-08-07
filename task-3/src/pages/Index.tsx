import { useState } from "react";
import { Book } from "@/types/book";
import { useBooks } from "@/hooks/useBooks";
import { BookCard } from "@/components/BookCard";
import { BookForm } from "@/components/BookForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Library, BookOpen, Users, Calendar } from "lucide-react";

const Index = () => {
  const { books, loading, createBook, updateBook, deleteBook } = useBooks();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recently-added");

  const allGenres = ["Fiction", "Non Fiction", "Mystery", "Romance", "Sci Fi", "Fantasy", "Biography", "History", "Science", "Technology", "Dystopian Fiction"];
  const availableGenres = Array.from(new Set(books.map(book => book.genre).filter(Boolean)));
  
  const filteredAndSortedBooks = books
    .filter(book => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recently-added":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest-first":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "title-a-z":
          return a.title.localeCompare(b.title);
        case "title-z-a":
          return b.title.localeCompare(a.title);
        case "author-a-z":
          return a.author.localeCompare(b.author);
        case "author-z-a":
          return b.author.localeCompare(a.author);
        case "publication-date":
          return (b.publication_year || 0) - (a.publication_year || 0);
        default:
          return 0;
      }
    });

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    await deleteBook(id);
  };

  const handleSubmit = async (data: any) => {
    if (selectedBook) {
      await updateBook(selectedBook.id, data);
    } else {
      await createBook(data);
    }
    setSelectedBook(null);
  };

  const handleCloseForm = () => {
    setSelectedBook(null);
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="bg-card border-b border-border/50 shadow-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Library className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  REST API Book Library
                </h1>
                <p className="text-sm text-muted-foreground">
                  Demonstrating CRUD operations with beautiful UI
                </p>
              </div>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 rounded-lg border border-border/50 shadow-card">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-library-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{books.length}</p>
                <p className="text-sm text-muted-foreground">Total Books</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border/50 shadow-card">
            <div className="flex items-center space-x-3">
              <Users className="h-8 w-8 text-library-secondary" />
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(books.map(book => book.author)).size}
                </p>
                <p className="text-sm text-muted-foreground">Authors</p>
              </div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border/50 shadow-card">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-library-accent" />
              <div>
                <p className="text-2xl font-bold text-foreground">{availableGenres.length}</p>
                <p className="text-sm text-muted-foreground">Genres</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-card p-6 rounded-lg border border-border/50 shadow-card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search books by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 focus:ring-primary"
              />
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full md:w-48 focus:ring-primary">
                <SelectValue placeholder="All Genres" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                <SelectItem value="all">All Genres</SelectItem>
                {allGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 focus:ring-primary">
                <SelectValue placeholder="Recently Added" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                <SelectItem value="recently-added">Recently Added</SelectItem>
                <SelectItem value="oldest-first">Oldest First</SelectItem>
                <SelectItem value="title-a-z">Title A-Z</SelectItem>
                <SelectItem value="title-z-a">Title Z-A</SelectItem>
                <SelectItem value="author-a-z">Author A-Z</SelectItem>
                <SelectItem value="author-z-a">Author Z-A</SelectItem>
                <SelectItem value="publication-date">Publication Date</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Filters */}
          {(searchTerm || selectedGenre !== "all" || sortBy !== "recently-added") && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="outline" className="gap-1">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedGenre !== "all" && (
                <Badge variant="outline" className="gap-1">
                  Genre: {selectedGenre}
                  <button
                    onClick={() => setSelectedGenre("all")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {sortBy !== "recently-added" && (
                <Badge variant="outline" className="gap-1">
                  Sort: {sortBy.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  <button
                    onClick={() => setSortBy("recently-added")}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Books Grid */}
        {filteredAndSortedBooks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || selectedGenre !== "all" ? "No books found" : "Your library is empty"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedGenre !== "all"
                ? "Try adjusting your search criteria"
                : "Start by adding your first book to the library"}
            </p>
            {!searchTerm && selectedGenre === "all" && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-primary text-primary-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Book
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedBooks.map((book, index) => (
              <div key={book.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <BookCard
                  book={book}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}

        {/* Results count */}
        {filteredAndSortedBooks.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredAndSortedBooks.length} of {books.length} books
            </p>
          </div>
        )}
      </div>

      {/* Book Form Modal */}
      <BookForm
        book={selectedBook}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default Index;
