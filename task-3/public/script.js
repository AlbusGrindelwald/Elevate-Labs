class BooksManager {
    constructor() {
        this.books = [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadBooks();
    }

    bindEvents() {
        const form = document.getElementById('bookForm');
        const cancelBtn = document.getElementById('cancelEdit');

        form.addEventListener('submit', (e) => this.handleSubmit(e));
        cancelBtn.addEventListener('click', () => this.cancelEdit());
    }

    async loadBooks() {
        try {
            this.showLoading();
            const response = await fetch('/api/books');
            const result = await response.json();
            
            if (result.success) {
                this.books = result.data;
                this.renderBooks();
                this.updateStats();
            } else {
                this.showToast('Failed to load books', 'error');
            }
        } catch (error) {
            console.error('Error loading books:', error);
            this.showToast('Error loading books', 'error');
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const bookData = {
            title: formData.get('title').trim(),
            author: formData.get('author').trim(),
            genre: formData.get('genre').trim(),
            year: formData.get('year') ? parseInt(formData.get('year')) : null
        };

        // Remove empty genre
        if (!bookData.genre) {
            delete bookData.genre;
        }

        try {
            let response;
            let message;

            if (this.editingId) {
                // Update existing book
                response = await fetch(`/api/books/${this.editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookData)
                });
                message = 'Book updated successfully!';
            } else {
                // Create new book
                response = await fetch('/api/books', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookData)
                });
                message = 'Book added successfully!';
            }

            const result = await response.json();

            if (result.success) {
                this.showToast(message, 'success');
                this.resetForm();
                this.loadBooks();
            } else {
                this.showToast(result.message || 'Operation failed', 'error');
            }
        } catch (error) {
            console.error('Error saving book:', error);
            this.showToast('Error saving book', 'error');
        }
    }

    async deleteBook(id) {
        if (!confirm('Are you sure you want to delete this book?')) {
            return;
        }

        try {
            const response = await fetch(`/api/books/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                this.showToast('Book deleted successfully!', 'success');
                this.loadBooks();
            } else {
                this.showToast(result.message || 'Failed to delete book', 'error');
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            this.showToast('Error deleting book', 'error');
        }
    }

    editBook(book) {
        this.editingId = book.id;
        
        // Fill form with book data
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('genre').value = book.genre || '';
        document.getElementById('year').value = book.year || '';

        // Update form appearance
        const submitBtn = document.querySelector('.btn-primary');
        const cancelBtn = document.getElementById('cancelEdit');
        
        submitBtn.textContent = 'Update Book';
        cancelBtn.style.display = 'inline-block';

        // Scroll to form
        document.querySelector('.form-section').scrollIntoView({ 
            behavior: 'smooth' 
        });

        this.showToast('Editing mode activated', 'info');
    }

    cancelEdit() {
        this.editingId = null;
        this.resetForm();
        this.showToast('Edit cancelled', 'info');
    }

    resetForm() {
        const form = document.getElementById('bookForm');
        const submitBtn = document.querySelector('.btn-primary');
        const cancelBtn = document.getElementById('cancelEdit');
        
        form.reset();
        submitBtn.textContent = 'Add Book';
        cancelBtn.style.display = 'none';
        this.editingId = null;
    }

    renderBooks() {
        const container = document.getElementById('booksContainer');
        
        if (this.books.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No books found</h3>
                    <p>Add your first book using the form above!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.books.map(book => `
            <div class="book-card">
                <div class="book-id">#${book.id}</div>
                <h3>${this.escapeHtml(book.title)}</h3>
                <div class="author">by ${this.escapeHtml(book.author)}</div>
                ${book.genre ? `<div class="genre">Genre: ${this.escapeHtml(book.genre)}</div>` : ''}
                ${book.year ? `<div class="year">Published: ${book.year}</div>` : ''}
                <div class="book-actions">
                    <button class="btn btn-edit" onclick="booksManager.editBook(${JSON.stringify(book).replace(/"/g, '&quot;')})">
                        Edit
                    </button>
                    <button class="btn btn-delete" onclick="booksManager.deleteBook(${book.id})">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const countElement = document.getElementById('bookCount');
        const count = this.books.length;
        countElement.textContent = `${count} book${count !== 1 ? 's' : ''}`;
    }

    showLoading() {
        const container = document.getElementById('booksContainer');
        container.innerHTML = '<div class="loading">Loading books...</div>';
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.booksManager = new BooksManager();
});