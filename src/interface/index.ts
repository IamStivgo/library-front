export interface Book {
   id?: number;
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
