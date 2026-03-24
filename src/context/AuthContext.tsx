import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
   id?: number;
   name?: string;
   email?: string;
   username?: string;
   roles?: string[];
   [key: string]: unknown;
}

interface AuthContextType {
   user: User | null;
   login: (userData: User) => void;
   logout: () => void;
   isAuthenticated: boolean;
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
         console.error('Error al leer usuario de localStorage:', error);
      }
      return null;
   });

   useEffect(() => {
      if (user) {
         localStorage.setItem('user', JSON.stringify(user));
      } else {
         localStorage.removeItem('user');
      }
   }, [user]);

   const login = (userData: User) => {
      console.log('Login exitoso:', userData);
      setUser(userData);
   };

   const logout = () => {
      console.log('Logout exitoso');
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
   };

   const isAuthenticated = user !== null;

   return (
      <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error('useAuth debe ser usado dentro de un AuthProvider');
   }
   return context;
};
