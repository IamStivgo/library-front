import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, AuthResponse } from '../services/auth.service';

interface User {
   id: string;
   name?: string;
   email: string;
   username?: string;
   avatarUrl?: string;
   roles: string[];
   permissions: string[];
}

interface AuthContextType {
   user: User | null;
   login: (email: string, password: string) => Promise<void>;
   loginWithGoogle: (googleToken: string) => Promise<void>;
   loginWithMicrosoft: (accessToken: string) => Promise<void>;
   loginWithGitHub: (accessToken: string) => Promise<void>;
   register: (email: string, password: string, fullName?: string, username?: string) => Promise<void>;
   logout: () => Promise<void>;
   isAuthenticated: boolean;
   loading: boolean;
   hasPermission: (permission: string) => boolean;
   hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [user, setUser] = useState<User | null>(() => {
      try {
         const storedUser = localStorage.getItem('user');
         if (storedUser) {
            return JSON.parse(storedUser);
         }
      } catch (error) {
         console.error('Error reading user from localStorage:', error);
      }
      return null;
   });

   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (user) {
         localStorage.setItem('user', JSON.stringify(user));
      } else {
         localStorage.removeItem('user');
      }
   }, [user]);

   const saveAuthData = (authData: AuthResponse) => {
      const userData: User = {
         id: authData.user.id,
         email: authData.user.email,
         name: authData.user.fullName,
         username: authData.user.username,
         avatarUrl: authData.user.avatarUrl,
         roles: authData.user.roles,
         permissions: authData.user.permissions,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('accessToken', authData.tokens.accessToken);
      localStorage.setItem('refreshToken', authData.tokens.refreshToken);
   };

   const login = async (email: string, password: string) => {
      setLoading(true);
      try {
         const authData = await authService.login({ email, password });
         saveAuthData(authData);
      } catch (error) {
         console.error('Login error:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const loginWithGoogle = async (googleToken: string) => {
      setLoading(true);
      try {
         const authData = await authService.googleAuth(googleToken);
         saveAuthData(authData);
      } catch (error) {
         console.error('Google login error:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const loginWithMicrosoft = async (accessToken: string) => {
      setLoading(true);
      try {
         const authData = await authService.microsoftAuth(accessToken);
         saveAuthData(authData);
      } catch (error) {
         console.error('Microsoft login error:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const loginWithGitHub = async (accessToken: string) => {
      setLoading(true);
      try {
         const authData = await authService.githubAuth(accessToken);
         saveAuthData(authData);
      } catch (error) {
         console.error('GitHub login error:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const register = async (email: string, password: string, fullName?: string, username?: string) => {
      setLoading(true);
      try {
         const authData = await authService.register({ email, password, fullName, username });
         saveAuthData(authData);
      } catch (error) {
         console.error('Register error:', error);
         throw error;
      } finally {
         setLoading(false);
      }
   };

   const logout = async () => {
      try {
         const refreshToken = localStorage.getItem('refreshToken');
         if (refreshToken) {
            await authService.logout(refreshToken);
         }
      } catch (error) {
         console.error('Logout error:', error);
      } finally {
         setUser(null);
         localStorage.removeItem('user');
         localStorage.removeItem('accessToken');
         localStorage.removeItem('refreshToken');
      }
   };

   const hasPermission = (permission: string): boolean => {
      return user?.permissions?.includes(permission) || false;
   };

   const hasRole = (role: string): boolean => {
      return user?.roles?.includes(role) || false;
   };

   const isAuthenticated = user !== null;

   return (
      <AuthContext.Provider
         value={{
            user,
            login,
            loginWithGoogle,
            loginWithMicrosoft,
            loginWithGitHub,
            register,
            logout,
            isAuthenticated,
            loading,
            hasPermission,
            hasRole,
         }}
      >
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};
