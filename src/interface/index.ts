export interface Book {
   id?: string;
   title: string;
   author: string;
   isbn: string;
   publisher?: string;
   publicationYear?: number;
   genre?: string;
   description?: string;
   status: 'checked-in' | 'checked-out';
   borrowerName?: string;
   borrowerEmail?: string;
   borrowDate?: string;
   dueDate?: string;
   createdAt?: string;
   updatedAt?: string;
}

export interface BookFilters {
   searchQuery?: string;
   status?: 'all' | 'checked-in' | 'checked-out';
   genre?: string;
}

export interface User {
   id?: number;
   name?: string;
   email?: string;
   username?: string;
   roles?: string[];
   [key: string]: unknown;
}

export interface ApiResponse<T> {
   data: T;
   message?: string;
   success: boolean;
}

export interface LoanHistory {
   id: string;
   bookId: string;
   bookTitle: string;
   bookAuthor?: string;
   bookIsbn?: string;
   borrowerName: string;
   borrowerEmail: string;
   checkoutDate: string;
   dueDate: string;
   returnDate?: string;
   status: 'active' | 'returned' | 'overdue';
   renewedCount: number;
   notes?: string;
   createdAt: string;
   updatedAt: string;
}
