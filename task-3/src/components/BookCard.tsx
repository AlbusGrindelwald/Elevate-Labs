import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Edit, Trash2, Calendar } from "lucide-react";

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
}

const getGenreColor = (genre: string) => {
  const colors: { [key: string]: string } = {
    'Fiction': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
    'Non Fiction': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
    'Mystery': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800',
    'Romance': 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800',
    'Sci Fi': 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-400 dark:border-cyan-800',
    'Fantasy': 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    'Biography': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    'History': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800',
    'Science': 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800',
    'Technology': 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800',
    'Dystopian Fiction': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  };
  return colors[genre] || 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
};

export function BookCard({ book, onEdit, onDelete }: BookCardProps) {
  return (
    <Card className="group hover:shadow-book transition-all duration-300 hover:-translate-y-2 bg-gradient-subtle border-border/50 h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2 text-foreground group-hover:text-primary transition-colors">
              {book.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-1">
              by {book.author}
            </CardDescription>
          </div>
          <BookOpen className="text-library-primary w-5 h-5 flex-shrink-0 ml-2" />
        </div>
        
        {book.genre && (
          <Badge variant="secondary" className={`w-fit mt-2 border ${getGenreColor(book.genre)}`}>
            {book.genre}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="pb-3 flex-1 flex flex-col">
        {book.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">
            {book.description}
          </p>
        )}
        
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-auto">
          {book.publication_year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {book.publication_year}
            </div>
          )}
          {book.isbn && (
            <div className="text-xs font-mono">
              ISBN: {book.isbn}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 gap-2 flex-shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(book)}
          className="flex-1 border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(book.id)}
          className="flex-1"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}