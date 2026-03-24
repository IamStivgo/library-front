import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage, DashboardPage } from './modulos/pages';
import { useAuth } from './context';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
   const { user } = useAuth();
   return user ? <>{children}</> : <Navigate to="/login" />;
};

const AppRoutes = () => {
   return (
      <BrowserRouter>
         <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
               path="/dashboard"
               element={
                  <ProtectedRoute>
                     <DashboardPage />
                  </ProtectedRoute>
               }
            />

            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
         </Routes>
      </BrowserRouter>
   );
};

export default AppRoutes;
