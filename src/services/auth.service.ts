import { api } from './api.service';

export interface LoginCredentials {
   email: string;
   password: string;
}

export interface RegisterData {
   email: string;
   password: string;
   username?: string;
   fullName?: string;
}

export interface AuthResponse {
   user: {
      id: string;
      email: string;
      username?: string;
      fullName?: string;
      avatarUrl?: string;
      roles: string[];
      permissions: string[];
   };
   tokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
   };
}

export const authService = {
   async login(credentials: LoginCredentials): Promise<AuthResponse> {
      const response = await api.post('/auth/login', credentials);
      return response.data.data;
   },

   async register(data: RegisterData): Promise<AuthResponse> {
      const response = await api.post('/auth/register', data);
      return response.data.data;
   },

   async googleAuth(googleToken: string): Promise<AuthResponse> {
      const response = await api.post('/auth/google', { googleToken });
      return response.data.data;
   },

   async microsoftAuth(accessToken: string): Promise<AuthResponse> {
      const response = await api.post('/auth/microsoft', { accessToken });
      return response.data.data;
   },

   async githubAuth(accessToken: string): Promise<AuthResponse> {
      const response = await api.post('/auth/github', { accessToken });
      return response.data.data;
   },

   async refreshToken(refreshToken: string): Promise<AuthResponse> {
      const response = await api.post('/auth/refresh', { refreshToken });
      return response.data.data;
   },

   async logout(refreshToken: string): Promise<void> {
      await api.post('/auth/logout', { refreshToken });
   },

   async getMe(): Promise<any> {
      const response = await api.get('/auth/me');
      return response.data.data;
   },
};
