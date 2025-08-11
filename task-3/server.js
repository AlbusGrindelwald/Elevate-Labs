const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for books
let books = [
  { id: 1, title: "To Kill a Mockingbird", author: "Harper Lee", genre: "Fiction", year: 1960 },
  { id: 2, title: "1984", author: "George Orwell", genre: "Dystopian Fiction", year: 1949 },
  { id: 3, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Fiction", year: 1925 }
];

let nextId = 4;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Custom middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Routes

// GET /api/books - Get all books
app.get('/api/books', (req, res) => {
  res.json({
    success: true,
    count: books.length,
    data: books
  });
});

// GET /api/books/:id - Get a specific book by ID
app.get('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid book ID',
      message: 'Book ID must be a valid number'
    });
  }

  const book = books.find(book => book.id === id);
  
  if (!book) {
    return res.status(404).json({
      success: false,
      error: 'Book not found',
      message: `Book with ID ${id} does not exist`
    });
  }

  res.json({
    success: true,
    data: book
  });
});

// POST /api/books - Create a new book
app.post('/api/books', (req, res) => {
  const { title, author, genre, year } = req.body;
  
  // Validation
  if (!title || !author) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      message: 'Title and author are required'
    });
  }

  const newBook = {
    id: nextId++,
    title: title.trim(),
    author: author.trim(),
    genre: genre ? genre.trim() : 'Unknown',
    year: year ? parseInt(year) : null,
    createdAt: new Date().toISOString()
  };

  books.push(newBook);
  
  res.status(201).json({
    success: true,
    message: 'Book created successfully',
    data: newBook
  });
});

// PUT /api/books/:id - Update a book by ID
app.put('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid book ID',
      message: 'Book ID must be a valid number'
    });
  }

  const bookIndex = books.findIndex(book => book.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Book not found',
      message: `Book with ID ${id} does not exist`
    });
  }

  const { title, author, genre, year } = req.body;
  
  // Update only provided fields
  if (title !== undefined) books[bookIndex].title = title.trim();
  if (author !== undefined) books[bookIndex].author = author.trim();
  if (genre !== undefined) books[bookIndex].genre = genre.trim();
  if (year !== undefined) books[bookIndex].year = parseInt(year);
  
  books[bookIndex].updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Book updated successfully',
    data: books[bookIndex]
  });
});

// DELETE /api/books/:id - Delete a book by ID
app.delete('/api/books/:id', (req, res) => {
  const id = parseInt(req.params.id);
  
  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid book ID',
      message: 'Book ID must be a valid number'
    });
  }

  const bookIndex = books.findIndex(book => book.id === id);
  
  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Book not found',
      message: `Book with ID ${id} does not exist`
    });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];
  
  res.json({
    success: true,
    message: 'Book deleted successfully',
    data: deletedBook
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Books REST API Server',
    version: '1.0.0',
    endpoints: {
      'GET /api/books': 'Get all books',
      'POST /api/books': 'Create a new book',
      'GET /api/books/:id': 'Get a book by ID',
      'PUT /api/books/:id': 'Update a book by ID',
      'DELETE /api/books/:id': 'Delete a book by ID'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Handle 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Books Management Server running on http://localhost:${PORT}`);
  console.log(`📚 Web Interface: http://localhost:${PORT}`);
  console.log(`🔗 API Documentation: http://localhost:${PORT}/api`);
});

module.exports = app;