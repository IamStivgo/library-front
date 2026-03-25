import { useAuth } from '../../context';
import AdminDashboard from './AdminDashboard';
import ReaderDashboard from './ReaderDashboard';

const DashboardPage = () => {
   const { user } = useAuth();

   // Verificar si el usuario es admin mediante su email
   const isAdmin = user?.email === 'admin@luminaledger.com';

   // Mostrar el dashboard correspondiente según el rol
   if (isAdmin) {
      return <AdminDashboard />;
   }

   return <ReaderDashboard />;
};

export default DashboardPage;
