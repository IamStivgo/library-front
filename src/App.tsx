import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context';
import AppRoutes from './routes';
import { luminaLedgerTheme } from './styles';

function App() {
   return (
      <ThemeProvider theme={luminaLedgerTheme}>
         <CssBaseline />
         <AuthProvider>
            <AppRoutes />
         </AuthProvider>
      </ThemeProvider>
   );
}

export default App;
