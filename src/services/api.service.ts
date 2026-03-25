import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../config/constants';

class ApiService {
   private axiosInstance: AxiosInstance;

   constructor() {
      this.axiosInstance = axios.create({
         baseURL: API_BASE_URL,
         headers: {
            'Content-Type': 'application/json',
         },
      });

      this.axiosInstance.interceptors.request.use(
         (config: InternalAxiosRequestConfig) => {
            const token = localStorage.getItem('accessToken');
            if (token && config.headers) {
               config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
         },
         (error) => {
            return Promise.reject(error);
         }
      );

      this.axiosInstance.interceptors.response.use(
         (response) => response,
         async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
               originalRequest._retry = true;

               try {
                  const refreshToken = localStorage.getItem('refreshToken');
                  if (refreshToken) {
                     const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                        refreshToken,
                     });

                     const { accessToken, refreshToken: newRefreshToken } = response.data.data.tokens;

                     localStorage.setItem('accessToken', accessToken);
                     localStorage.setItem('refreshToken', newRefreshToken);

                     originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                     return this.axiosInstance(originalRequest);
                  }
               } catch (refreshError) {
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                  return Promise.reject(refreshError);
               }
            }

            return Promise.reject(error);
         }
      );
   }

   getInstance(): AxiosInstance {
      return this.axiosInstance;
   }
}

export const apiService = new ApiService();
export const api = apiService.getInstance();
