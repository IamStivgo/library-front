import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Box,
   TextField,
   Button,
   Typography,
   Container,
   Paper,
   Checkbox,
   FormControlLabel,
   Link,
   InputAdornment,
   IconButton,
   Grid,
} from '@mui/material';
import {
   MenuBook as MenuBookIcon,
   AlternateEmail as AlternateEmailIcon,
   Lock as LockIcon,
   ArrowForward as ArrowForwardIcon,
   Visibility,
   VisibilityOff,
} from '@mui/icons-material';
import { useAuth } from '../../context';

const LoginPage = () => {
   const navigate = useNavigate();
   const { login } = useAuth();
   const [showPassword, setShowPassword] = useState(false);
   const [formData, setFormData] = useState({
      identifier: '',
      password: '',
      rememberMe: false,
   });

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      login({
         id: 1,
         name: 'Curator',
         email: formData.identifier,
         username: formData.identifier,
      });
      
      navigate('/dashboard');
   };

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, checked } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: name === 'rememberMe' ? checked : value,
      }));
   };

   return (
      <Box
         sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, rgba(0, 94, 184, 0.05) 0%, rgba(76, 96, 116, 0.05) 100%)',
            position: 'relative',
            overflow: 'hidden',
         }}
      >
         <Box
            sx={{
               position: 'absolute',
               top: 0,
               right: 0,
               width: '500px',
               height: '500px',
               background: 'rgba(205, 226, 249, 0.2)',
               filter: 'blur(120px)',
               borderRadius: '50%',
               transform: 'translate(50%, -50%)',
            }}
         />
         <Box
            sx={{
               position: 'absolute',
               bottom: 0,
               left: 0,
               width: '400px',
               height: '400px',
               background: 'rgba(0, 94, 184, 0.1)',
               filter: 'blur(100px)',
               borderRadius: '50%',
               transform: 'translate(-33%, 33%)',
            }}
         />

         <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Paper
               elevation={0}
               sx={{
                  display: 'flex',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
                  minHeight: '700px',
               }}
            >
               <Grid container>
                  <Grid
                     item
                     xs={12}
                     md={6}
                     sx={{
                        display: { xs: 'none', md: 'flex' },
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 6,
                        background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                        position: 'relative',
                        '&::before': {
                           content: '""',
                           position: 'absolute',
                           inset: 0,
                           backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800)',
                           backgroundSize: 'cover',
                           backgroundPosition: 'center',
                           opacity: 0.4,
                           mixBlendMode: 'overlay',
                        },
                     }}
                  >
                     <Box sx={{ position: 'relative', zIndex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                           <Box
                              sx={{
                                 width: 40,
                                 height: 40,
                                 borderRadius: '12px',
                                 bgcolor: 'white',
                                 display: 'flex',
                                 alignItems: 'center',
                                 justifyContent: 'center',
                              }}
                           >
                              <MenuBookIcon sx={{ color: '#00478d' }} />
                           </Box>
                           <Typography
                              variant="h4"
                              sx={{
                                 fontFamily: '"Manrope", sans-serif',
                                 fontWeight: 800,
                                 color: 'white',
                                 letterSpacing: '-0.02em',
                              }}
                           >
                              Lumina Ledger
                           </Typography>
                        </Box>
                     </Box>

                     <Box sx={{ position: 'relative', zIndex: 1, maxWidth: '500px' }}>
                        <Typography
                           variant="h2"
                           sx={{
                              fontFamily: '"Manrope", sans-serif',
                              fontWeight: 700,
                              fontSize: '2.5rem',
                              color: 'white',
                              mb: 3,
                              lineHeight: 1.2,
                           }}
                        >
                           The art of intellectual preservation.
                        </Typography>
                        <Typography
                           sx={{
                              color: 'rgba(255, 255, 255, 0.9)',
                              fontSize: '1.125rem',
                              lineHeight: 1.6,
                           }}
                        >
                           Enter your digital sanctuary. Manage your collection with the precision of a
                           master curator.
                        </Typography>
                     </Box>

                     <Box
                        sx={{
                           position: 'relative',
                           zIndex: 1,
                           display: 'flex',
                           gap: 2,
                           alignItems: 'center',
                           color: 'rgba(255, 255, 255, 0.7)',
                           fontSize: '0.75rem',
                           textTransform: 'uppercase',
                           letterSpacing: '0.1em',
                        }}
                     >
                        <span>Archive</span>
                        <Box
                           sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255, 255, 255, 0.5)' }}
                        />
                        <span>Knowledge</span>
                        <Box
                           sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255, 255, 255, 0.5)' }}
                        />
                        <span>Legacy</span>
                     </Box>
                  </Grid>

                  <Grid
                     item
                     xs={12}
                     md={6}
                     sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        p: { xs: 4, md: 8 },
                        bgcolor: 'white',
                     }}
                  >
                     <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 2, mb: 6 }}>
                        <Box
                           sx={{
                              width: 40,
                              height: 40,
                              borderRadius: '12px',
                              bgcolor: '#00478d',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                           }}
                        >
                           <MenuBookIcon sx={{ color: 'white' }} />
                        </Box>
                        <Typography
                           variant="h5"
                           sx={{
                              fontFamily: '"Manrope", sans-serif',
                              fontWeight: 800,
                              color: '#00478d',
                           }}
                        >
                           Lumina Ledger
                        </Typography>
                     </Box>

                     <Box sx={{ maxWidth: 400, mx: 'auto', width: '100%' }}>
                        <Box sx={{ mb: 5 }}>
                           <Typography
                              variant="h3"
                              sx={{
                                 fontFamily: '"Manrope", sans-serif',
                                 fontWeight: 700,
                                 mb: 1,
                              }}
                           >
                              Welcome Back
                           </Typography>
                           <Typography variant="body1" color="text.secondary">
                              Please enter your credentials to access the archive.
                           </Typography>
                        </Box>

                        <form onSubmit={handleSubmit}>
                           <Box sx={{ mb: 3 }}>
                              <Typography
                                 variant="body2"
                                 sx={{ fontWeight: 600, mb: 1, ml: 0.5, color: 'text.secondary' }}
                              >
                                 Email or Username
                              </Typography>
                              <TextField
                                 fullWidth
                                 name="identifier"
                                 placeholder="curator@luminaledger.com"
                                 value={formData.identifier}
                                 onChange={handleChange}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <AlternateEmailIcon sx={{ color: 'text.secondary' }} />
                                       </InputAdornment>
                                    ),
                                 }}
                                 sx={{
                                    '& .MuiOutlinedInput-root': {
                                       borderRadius: '12px',
                                    },
                                 }}
                              />
                           </Box>

                           <Box sx={{ mb: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, ml: 0.5 }}>
                                 <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                                    Password
                                 </Typography>
                                 <Link
                                    href="#"
                                    sx={{
                                       fontSize: '0.875rem',
                                       fontWeight: 600,
                                       textDecoration: 'none',
                                       '&:hover': { textDecoration: 'underline' },
                                    }}
                                 >
                                    Forgot password?
                                 </Link>
                              </Box>
                              <TextField
                                 fullWidth
                                 name="password"
                                 type={showPassword ? 'text' : 'password'}
                                 placeholder="••••••••••••"
                                 value={formData.password}
                                 onChange={handleChange}
                                 InputProps={{
                                    startAdornment: (
                                       <InputAdornment position="start">
                                          <LockIcon sx={{ color: 'text.secondary' }} />
                                       </InputAdornment>
                                    ),
                                    endAdornment: (
                                       <InputAdornment position="end">
                                          <IconButton
                                             onClick={() => setShowPassword(!showPassword)}
                                             edge="end"
                                          >
                                             {showPassword ? <VisibilityOff /> : <Visibility />}
                                          </IconButton>
                                       </InputAdornment>
                                    ),
                                 }}
                                 sx={{
                                    '& .MuiOutlinedInput-root': {
                                       borderRadius: '12px',
                                    },
                                 }}
                              />
                           </Box>

                           <Box sx={{ mb: 4 }}>
                              <FormControlLabel
                                 control={
                                    <Checkbox
                                       name="rememberMe"
                                       checked={formData.rememberMe}
                                       onChange={handleChange}
                                    />
                                 }
                                 label="Remember me for 30 days"
                              />
                           </Box>

                           <Button
                              type="submit"
                              fullWidth
                              variant="contained"
                              size="large"
                              endIcon={<ArrowForwardIcon />}
                              sx={{
                                 py: 1.5,
                                 fontSize: '1rem',
                                 fontWeight: 700,
                                 borderRadius: '9999px',
                                 textTransform: 'none',
                                 background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                                 '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 8px 16px rgba(0, 71, 141, 0.2)',
                                 },
                              }}
                           >
                              Sign In to Dashboard
                           </Button>
                        </form>

                        <Box sx={{ mt: 6, textAlign: 'center' }}>
                           <Typography variant="body2" color="text.secondary">
                              New curator to the system?{' '}
                              <Link
                                 href="#"
                                 sx={{
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    '&:hover': { textDecoration: 'underline' },
                                 }}
                              >
                                 Request access
                              </Link>
                           </Typography>
                        </Box>
                     </Box>
                  </Grid>
               </Grid>
            </Paper>
         </Container>
      </Box>
   );
};

export default LoginPage;
