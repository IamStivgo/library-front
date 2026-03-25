import { api } from './api.service';

export interface ChatMessage {
   role: 'user' | 'assistant';
   content: string;
}

export interface BookRecommendation {
   title: string;
   author?: string;
   reasoning: string;
   genre?: string;
}

export interface RecommendationPreferences {
   favoriteGenres?: string[];
   favoriteAuthors?: string[];
   recentReads?: string[];
   interests?: string[];
}

export const aiService = {
   async chat(messages: ChatMessage[], includeBookContext: boolean = false): Promise<string> {
      const response = await api.post('/ai/chat', { messages, includeBookContext });
      return response.data.data.message;
   },

   async getRecommendations(preferences: RecommendationPreferences): Promise<BookRecommendation[]> {
      const response = await api.post('/ai/recommendations', preferences);
      return response.data.data.recommendations;
   },

   async getBookSummary(bookId: string): Promise<string> {
      const response = await api.get(`/ai/books/${bookId}/summary`);
      return response.data.data.summary;
   },

   async getCollectionAnalysis(): Promise<string> {
      const response = await api.get('/ai/collection/analysis');
      return response.data.data.analysis;
   },

   async semanticSearch(query: string): Promise<any> {
      const response = await api.post('/ai/search/semantic', { query });
      return response.data.data;
   },

   async getReadingTrends(checkoutHistory: Array<{
      bookTitle: string;
      bookAuthor: string;
      bookGenre?: string;
      checkoutDate: string;
      returnDate?: string;
   }>): Promise<string> {
      const response = await api.post('/ai/reading-trends', { checkoutHistory });
      return response.data.data.analysis;
   },

   async generateBookDescription(bookId: string): Promise<{ description: string; bookId: string }> {
      const response = await api.post(`/ai/books/${bookId}/generate-description`);
      return response.data.data;
   },

   async generateSmartNotification(userName: string, notificationType: string, data: any): Promise<{ title: string; message: string }> {
      const response = await api.post('/ai/notifications/generate', { userName, notificationType, data });
      return response.data.data;
   },
};
