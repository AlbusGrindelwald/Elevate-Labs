import { useState, useEffect } from "react";
import { Book, CreateBookRequest, UpdateBookRequest } from "@/types/book";
import { toast } from "@/hooks/use-toast";

// Mock data for demonstration - in a real app this would be Supabase calls
const initialBooks: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    isbn: "978-0-7432-7356-5",
    publication_year: 1925,
    genre: "Fiction",
    description: "A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.",
    created_at: "2024-08-07T10:00:00Z",
    updated_at: "2024-08-07T10:00:00Z"
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    isbn: "978-0-06-112008-4",
    publication_year: 1960,
    genre: "Fiction",
    description: "A gripping tale of racial injustice and childhood innocence in the American South.",
    created_at: "2024-08-07T10:01:00Z",
    updated_at: "2024-08-07T10:01:00Z"
  },
  {
    id: 3,
    title: "1984",
    author: "George Orwell",
    isbn: "978-0-452-28423-4",
    publication_year: 1949,
    genre: "Dystopian Fiction",
    description: "A dystopian social science fiction novel about totalitarian control and surveillance.",
    created_at: "2024-08-07T10:02:00Z",
    updated_at: "2024-08-07T10:02:00Z"
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    isbn: "978-0-14-143951-8",
    publication_year: 1813,
    genre: "Romance",
    description: "A romantic novel of manners that critiques the British landed gentry at the end of the 18th century.",
    created_at: "2024-08-07T10:03:00Z",
    updated_at: "2024-08-07T10:03:00Z"
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    isbn: "978-0-316-76948-0",
    publication_year: 1951,
    genre: "Fiction",
    description: "A controversial novel about teenage rebellion and alienation in modern society.",
    created_at: "2024-08-07T10:04:00Z",
    updated_at: "2024-08-07T10:04:00Z"
  }
];

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulate API loading
  useEffect(() => {
    const loadBooks = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBooks(initialBooks);
      setLoading(false);
    };

    loadBooks();
  }, []);

  // GET /books - Fetch all books
  const fetchBooks = async (): Promise<Book[]> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
      return books;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch books",
        variant: "destructive"
      });
      setLoading(false);
      return [];
    }
  };

  // POST /books - Create a new book
  const createBook = async (bookData: CreateBookRequest): Promise<Book> => {
    try {
      const newId = Math.max(...books.map(b => b.id), 0) + 1;
      const now = new Date().toISOString();
      
      const newBook: Book = {
        ...bookData,
        id: newId,
        created_at: now,
        updated_at: now
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBooks(prev => [...prev, newBook]);
      
      toast({
        title: "Success",
        description: `"${newBook.title}" has been added to your library`,
      });

      return newBook;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create book",
        variant: "destructive"
      });
      throw error;
    }
  };

  // PUT /books/:id - Update a book
  const updateBook = async (id: number, bookData: Partial<CreateBookRequest>): Promise<Book> => {
    try {
      const bookIndex = books.findIndex(b => b.id === id);
      if (bookIndex === -1) {
        throw new Error("Book not found");
      }

      const updatedBook: Book = {
        ...books[bookIndex],
        ...bookData,
        updated_at: new Date().toISOString()
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setBooks(prev => prev.map(book => 
        book.id === id ? updatedBook : book
      ));

      toast({
        title: "Success",
        description: `"${updatedBook.title}" has been updated`,
      });

      return updatedBook;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update book",
        variant: "destructive"
      });
      throw error;
    }
  };

  // DELETE /books/:id - Delete a book
  const deleteBook = async (id: number): Promise<void> => {
    try {
      const book = books.find(b => b.id === id);
      if (!book) {
        throw new Error("Book not found");
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setBooks(prev => prev.filter(book => book.id !== id));

      toast({
        title: "Success",
        description: `"${book.title}" has been removed from your library`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete book",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    books,
    loading,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook
  };
}