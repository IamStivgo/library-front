import { api } from './apiClient';
import { Book, ApiResponse } from '../interface';

export const bookService = {
   async getAllBooks(): Promise<Book[]> {
      try {
         const response = await api.get<ApiResponse<Book[]>>('/books');
         return response.data.data;
      } catch (error) {
         console.error('Error fetching books:', error);
         throw error;
      }
   },

   async getBookById(id: number): Promise<Book> {
      try {
         const response = await api.get<ApiResponse<Book>>(`/books/${id}`);
         return response.data.data;
      } catch (error) {
         console.error('Error fetching book:', error);
         throw error;
      }
   },

   async createBook(book: Omit<Book, 'id'>): Promise<Book> {
      try {
         const response = await api.post<ApiResponse<Book>>('/books', book);
         return response.data.data;
      } catch (error) {
         console.error('Error creating book:', error);
         throw error;
      }
   },

   async updateBook(id: number, book: Partial<Book>): Promise<Book> {
      try {
         const response = await api.put<ApiResponse<Book>>(`/books/${id}`, book);
         return response.data.data;
      } catch (error) {
         console.error('Error updating book:', error);
         throw error;
      }
   },

   async deleteBook(id: number): Promise<void> {
      try {
         await api.delete(`/books/${id}`);
      } catch (error) {
         console.error('Error deleting book:', error);
         throw error;
      }
   },

   async checkOutBook(
      id: number,
      borrowerInfo: { borrowerName: string; borrowerEmail: string; dueDate: string }
   ): Promise<Book> {
      try {
         const response = await api.post<ApiResponse<Book>>(`/books/${id}/checkout`, borrowerInfo);
         return response.data.data;
      } catch (error) {
         console.error('Error checking out book:', error);
         throw error;
      }
   },

   async checkInBook(id: number): Promise<Book> {
      try {
         const response = await api.post<ApiResponse<Book>>(`/books/${id}/checkin`);
         return response.data.data;
      } catch (error) {
         console.error('Error checking in book:', error);
         throw error;
      }
   },

   async searchBooks(query: string): Promise<Book[]> {
      try {
         const response = await api.get<ApiResponse<Book[]>>('/books/search', {
            params: { q: query },
         });
         return response.data.data;
      } catch (error) {
         console.error('Error searching books:', error);
         throw error;
      }
   },
};
