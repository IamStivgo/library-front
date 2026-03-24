import { createTheme } from '@mui/material/styles';

const luminaLedgerTheme = createTheme({
   palette: {
      primary: {
         main: '#00478d',
         light: '#005eb8',
         dark: '#001b3d',
         contrastText: '#ffffff',
      },
      secondary: {
         main: '#4c6074',
         light: '#cde2f9',
         dark: '#35495b',
         contrastText: '#ffffff',
      },
      error: {
         main: '#ba1a1a',
         light: '#ffdad6',
         dark: '#93000a',
         contrastText: '#ffffff',
      },
      success: {
         main: '#005412',
         light: '#a3f69c',
         dark: '#1d6e25',
         contrastText: '#ffffff',
      },
      background: {
         default: '#f7fafc',
         paper: '#ffffff',
      },
      text: {
         primary: '#181c1e',
         secondary: '#424752',
         disabled: '#727783',
      },
   },
   typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
         fontFamily: '"Manrope", "Inter", sans-serif',
         fontWeight: 800,
         fontSize: '2.5rem',
         letterSpacing: '-0.02em',
      },
      h2: {
         fontFamily: '"Manrope", "Inter", sans-serif',
         fontWeight: 700,
         fontSize: '2rem',
         letterSpacing: '-0.01em',
      },
      h3: {
         fontFamily: '"Manrope", "Inter", sans-serif',
         fontWeight: 700,
         fontSize: '1.5rem',
      },
      h4: {
         fontFamily: '"Manrope", "Inter", sans-serif',
         fontWeight: 700,
         fontSize: '1.25rem',
      },
      h5: {
         fontFamily: '"Manrope", "Inter", sans-serif',
         fontWeight: 600,
         fontSize: '1.125rem',
      },
      h6: {
         fontFamily: '"Manrope", "Inter", sans-serif',
         fontWeight: 600,
         fontSize: '1rem',
      },
      body1: {
         fontFamily: '"Inter", sans-serif',
         fontSize: '1rem',
         lineHeight: 1.6,
      },
      body2: {
         fontFamily: '"Inter", sans-serif',
         fontSize: '0.875rem',
         lineHeight: 1.5,
      },
      button: {
         fontFamily: '"Inter", sans-serif',
         fontWeight: 600,
         textTransform: 'none',
      },
   },
   shape: {
      borderRadius: 12,
   },
   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               borderRadius: '9999px',
               padding: '12px 24px',
               fontWeight: 600,
               boxShadow: 'none',
               '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 71, 141, 0.15)',
               },
            },
            contained: {
               background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
               '&:hover': {
                  background: 'linear-gradient(135deg, #005eb8 0%, #00478d 100%)',
               },
            },
         },
      },
      MuiCard: {
         styleOverrides: {
            root: {
               borderRadius: '16px',
               boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
               '&:hover': {
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
               },
            },
         },
      },
      MuiTextField: {
         styleOverrides: {
            root: {
               '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#f1f4f6',
                  '& input': {
                     color: '#181c1e',
                  },
                  '& textarea': {
                     color: '#181c1e',
                  },
                  '& fieldset': {
                     borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                     borderColor: 'rgba(194, 198, 212, 0.2)',
                  },
                  '&.Mui-focused': {
                     backgroundColor: '#ffffff',
                     '& fieldset': {
                        borderColor: '#00478d',
                     },
                  },
               },
            },
         },
      },
      MuiPaper: {
         styleOverrides: {
            root: {
               borderRadius: '16px',
            },
         },
      },
   },
});

export default luminaLedgerTheme;
