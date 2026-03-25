import { api } from './apiClient';
import { LoanHistory, ApiResponse } from '../interface';

export const loanHistoryService = {
   async getLoanHistory(email?: string): Promise<LoanHistory[]> {
      try {
         const params = email ? { email } : {};
         const response = await api.get<ApiResponse<LoanHistory[]>>('/loan-history', { params });
         return response.data.data;
      } catch (error) {
         console.error('Error fetching loan history:', error);
         throw error;
      }
   },
};
