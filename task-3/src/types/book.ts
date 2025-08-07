export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  publication_year?: number;
  genre?: string;
  description?: string;
  cover_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn?: string;
  publication_year?: number;
  genre?: string;
  description?: string;
  cover_url?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
  id: number;
}