import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Box,
   Typography,
   Button,
   Card,
   IconButton,
   Avatar,
   Grid,
   Menu,
   MenuItem,
   Divider,
   ListItemIcon,
   TextField,
   InputAdornment,
} from '@mui/material';
import {
   Search as SearchIcon,
   Notifications as NotificationsIcon,
   Alarm as AlarmIcon,
   CheckCircle as CheckCircleIcon,
   ArrowForward as ArrowForwardIcon,
   AutoStories as AutoStoriesIcon,
   BookmarkAdd as BookmarkAddIcon,
   Home as HomeIcon,
   Person as PersonIcon,
   Settings as SettingsIcon,
   Logout as LogoutIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAuth } from '../../context';
import { bookService } from '../../services';
import { Book } from '../../interface';
import { CheckOutDialog } from '../../components/atoms';
import LoanHistoryView from './LoanHistoryView';

const ReaderDashboard = () => {
   const navigate = useNavigate();
   const { user, logout } = useAuth();
   const [searchQuery, setSearchQuery] = useState('');
   const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
   const [books, setBooks] = useState<Book[]>([]);
   const [activeTab, setActiveTab] = useState('dashboard');
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
   const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
   const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
   const openMenu = Boolean(anchorEl);

   const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
   };

   const handleMenuClose = () => {
      setAnchorEl(null);
   };

   const handleLogout = () => {
      handleMenuClose();
      logout();
      navigate('/login');
   };

   useEffect(() => {
      loadBooks();
   }, []);

   const loadBooks = async () => {
      try {
         const data = await bookService.getAllBooks();
         setBooks(data);
      } catch (err) {
         console.error('Error loading books:', err);
      }
   };

   const handleRequestBorrow = (book: Book) => {
      if (book.status === 'checked-out') {
         Swal.fire({
            icon: 'info',
            title: 'Book Not Available',
            text: 'This book is currently checked out by another user.',
            confirmButtonColor: '#005eb8',
         });
         return;
      }
      setSelectedBook(book);
      setCheckOutDialogOpen(true);
   };

   const handleCheckOut = async (borrowerInfo: {
      borrowerName: string;
      borrowerEmail: string;
      dueDate: string;
   }) => {
      if (!selectedBook?.id) return;

      try {
         // Convertir fecha a formato ISO
         const dueDateISO = new Date(borrowerInfo.dueDate).toISOString();
         
         const updatedBook = await bookService.checkOutBook(selectedBook.id, {
            ...borrowerInfo,
            dueDate: dueDateISO,
         });
         
         setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
         
         await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: `"${selectedBook.title}" has been checked out successfully.`,
            timer: 2000,
            showConfirmButton: false,
         });
         
         loadBooks(); // Recargar la lista
      } catch (err: any) {
         console.error('Error checking out book:', err);
         await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data?.message || 'Could not check out the book. Please try again.',
            confirmButtonColor: '#005eb8',
         });
      }
   };

   const handleRenewBorrow = async (book: Book) => {
      if (!book.id) {
         await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid book ID',
            confirmButtonColor: '#005eb8',
         });
         return;
      }

      const { value: newDueDate } = await Swal.fire({
         title: 'Renew Borrow',
         html: `
            <p>Extend the due date for <strong>"${book.title}"</strong></p>
            <input type="date" id="newDueDate" class="swal2-input" min="${new Date().toISOString().split('T')[0]}" style="width: 80%; margin-top: 10px;">
         `,
         showCancelButton: true,
         confirmButtonText: 'Renew',
         confirmButtonColor: '#005eb8',
         cancelButtonText: 'Cancel',
         preConfirm: () => {
            const dateInput = document.getElementById('newDueDate') as HTMLInputElement;
            if (!dateInput.value) {
               Swal.showValidationMessage('Please select a new due date');
               return null;
            }
            return dateInput.value;
         },
      });

      if (!newDueDate) return;

      try {
         const dueDateISO = new Date(newDueDate).toISOString();
         
         const updatedBook = await bookService.renewBook(book.id, dueDateISO);
         
         setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
         
         await Swal.fire({
            icon: 'success',
            title: 'Renewed!',
            text: `Due date extended to ${new Date(newDueDate).toLocaleDateString()}`,
            timer: 2000,
            showConfirmButton: false,
         });
         
         loadBooks();
      } catch (err: any) {
         console.error('Error renewing book:', err);
         await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data?.message || 'Could not renew the book. Please try again.',
            confirmButtonColor: '#005eb8',
         });
      }
   };

   const handleMarkFinished = async (book: Book) => {
      if (!book.id) {
         await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Invalid book ID',
            confirmButtonColor: '#005eb8',
         });
         return;
      }

      const result = await Swal.fire({
         title: 'Mark as Finished?',
         html: `Are you sure you want to return <strong>"${book.title}"</strong>?`,
         icon: 'question',
         showCancelButton: true,
         confirmButtonText: 'Yes, return it',
         confirmButtonColor: '#005eb8',
         cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) return;

      try {
         const updatedBook = await bookService.checkInBook(book.id);
         
         setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
         
         await Swal.fire({
            icon: 'success',
            title: 'Book Returned!',
            text: `"${book.title}" has been returned successfully.`,
            timer: 2000,
            showConfirmButton: false,
         });
         
         loadBooks();
      } catch (err: any) {
         console.error('Error returning book:', err);
         await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data?.message || 'Could not return the book. Please try again.',
            confirmButtonColor: '#005eb8',
         });
      }
   };

   // Filtrar libros por usuario actual (simulado - aquí deberías filtrar por el email del usuario actual)
   const myBorrowedBooks = books.filter(book => 
      book.status === 'checked-out' && book.borrowerEmail === user?.email
   );
   
   // Libros disponibles para sugerencias
   const availableBooks = books.filter(book => book.status === 'checked-in');
   const suggestedBooks = availableBooks.slice(0, 2);
   const newArrivals = availableBooks.slice(2, 6);

   // Calcular días restantes
   const getDaysRemaining = (dueDate?: Date | string) => {
      if (!dueDate) return 0;
      const today = new Date();
      const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
      const diffTime = due.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
   };

   return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f7fafc' }}>
         {/* Top Navigation Bar */}
         <Box
            component="nav"
            sx={{
               position: 'fixed',
               top: 0,
               width: '100%',
               zIndex: 50,
               bgcolor: 'rgba(248, 250, 252, 0.8)',
               backdropFilter: 'blur(12px)',
            }}
         >
            <Box
               sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 3,
                  py: 1.5,
               }}
            >
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Typography
                     sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        letterSpacing: '-0.05em',
                        color: '#005eb8',
                     }}
                  >
                     Lumina Ledger
                  </Typography>
                  <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
                     <Button
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 700,
                           fontSize: '1.125rem',
                           color: activeTab === 'dashboard' ? '#005eb8' : 'text.secondary',
                           borderBottom: activeTab === 'dashboard' ? '2px solid #005eb8' : 'none',
                           borderRadius: 0,
                           pb: 0.5,
                           '&:hover': { color: '#005eb8' },
                        }}
                        onClick={() => setActiveTab('dashboard')}
                     >
                        Dashboard
                     </Button>
                     <Button
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 700,
                           fontSize: '1.125rem',
                           color: activeTab === 'catalog' ? '#005eb8' : 'text.secondary',
                           borderBottom: activeTab === 'catalog' ? '2px solid #005eb8' : 'none',
                           borderRadius: 0,
                           pb: 0.5,
                           '&:hover': { color: '#005eb8' },
                        }}
                        onClick={() => setActiveTab('catalog')}
                     >
                        Catalog
                     </Button>
                     <Button
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 700,
                           fontSize: '1.125rem',
                           color: activeTab === 'history' ? '#005eb8' : 'text.secondary',
                           borderBottom: activeTab === 'history' ? '2px solid #005eb8' : 'none',
                           borderRadius: 0,
                           pb: 0.5,
                           '&:hover': { color: '#005eb8' },
                        }}
                        onClick={() => setActiveTab('history')}
                     >
                        History
                     </Button>
                     <Button
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 700,
                           fontSize: '1.125rem',
                           color: 'text.secondary',
                           '&:hover': { color: '#005eb8' },
                        }}
                     >
                        Members
                     </Button>
                  </Box>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                     sx={{
                        display: { xs: 'none', md: 'flex' },
                        alignItems: 'center',
                        bgcolor: '#f1f4f6',
                        px: 2,
                        py: 1,
                        borderRadius: '9999px',
                     }}
                  >
                     <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                     <input
                        type="text"
                        placeholder="Search archives..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                           border: 'none',
                           background: 'transparent',
                           outline: 'none',
                           fontSize: '0.875rem',
                           width: '192px',
                        }}
                     />
                  </Box>
                  <IconButton
                     sx={{
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                     }}
                  >
                     <NotificationsIcon />
                  </IconButton>
                  <Box
                     sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        pl: 2,
                        borderLeft: '1px solid #e5e9eb',
                     }}
                  >
                     <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                           {user?.name || 'Alex Reader'}
                        </Typography>
                        <Typography
                           sx={{
                              fontSize: '0.625rem',
                              color: 'text.secondary',
                           }}
                        >
                           Premium Member
                        </Typography>
                     </Box>
                     <IconButton
                        onClick={handleMenuClick}
                        sx={{
                           p: 0,
                           '&:hover': { opacity: 0.8 },
                        }}
                     >
                        <Avatar
                           sx={{
                              width: 40,
                              height: 40,
                              bgcolor: '#005eb8',
                              border: '2px solid #d6e3ff',
                           }}
                           alt={user?.name || 'User'}
                        />
                     </IconButton>
                     <Menu
                        anchorEl={anchorEl}
                        open={openMenu}
                        onClose={handleMenuClose}
                        onClick={handleMenuClose}
                        PaperProps={{
                           elevation: 3,
                           sx: {
                              overflow: 'visible',
                              mt: 1.5,
                              minWidth: 200,
                              borderRadius: '12px',
                              '&:before': {
                                 content: '""',
                                 display: 'block',
                                 position: 'absolute',
                                 top: 0,
                                 right: 14,
                                 width: 10,
                                 height: 10,
                                 bgcolor: 'background.paper',
                                 transform: 'translateY(-50%) rotate(45deg)',
                                 zIndex: 0,
                              },
                           },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                     >
                        <Box sx={{ px: 2, py: 1.5 }}>
                           <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                              {user?.name || 'User'}
                           </Typography>
                           <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                              {user?.email}
                           </Typography>
                        </Box>
                        <Divider />
                        <MenuItem sx={{ py: 1.5 }}>
                           <ListItemIcon>
                              <PersonIcon fontSize="small" />
                           </ListItemIcon>
                           My Profile
                        </MenuItem>
                        <MenuItem sx={{ py: 1.5 }}>
                           <ListItemIcon>
                              <SettingsIcon fontSize="small" />
                           </ListItemIcon>
                           Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: '#ba1a1a' }}>
                           <ListItemIcon>
                              <LogoutIcon fontSize="small" sx={{ color: '#ba1a1a' }} />
                           </ListItemIcon>
                           Logout
                        </MenuItem>
                     </Menu>
                  </Box>
               </Box>
            </Box>
            <Box sx={{ height: 1, bgcolor: 'rgba(229, 233, 235, 0.5)' }} />
         </Box>

         {/* Main Content */}
         <Box
            component="main"
            sx={{
               pt: 12,
               pb: 16,
               px: 3,
               maxWidth: 1280,
               mx: 'auto',
            }}
         >
            {activeTab === 'dashboard' && (
               <>
                  {/* Welcome Header */}
                  <Box sx={{ mb: 6 }}>
                     <Typography
                        variant="h3"
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 800,
                           letterSpacing: '-0.02em',
                           mb: 1,
                        }}
                     >
                        Good morning, {user?.name?.split(' ')[0] || 'Reader'}.
                     </Typography>
                     <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
                        {myBorrowedBooks.length === 0 
                           ? 'Start your literary journey by borrowing a book.'
                           : `Your literary journey continues. You have ${myBorrowedBooks.filter(b => getDaysRemaining(b.dueDate) <= 7).length} book${myBorrowedBooks.filter(b => getDaysRemaining(b.dueDate) <= 7).length !== 1 ? 's' : ''} due this week.`
                        }
                     </Typography>
                  </Box>

                  {/* Bento Grid Layout */}
                  <Grid container spacing={4}>
               {/* Currently Reading Section */}
               <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                     <Typography
                        variant="h5"
                        sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700 }}
                     >
                        Currently Reading
                     </Typography>
                     <Button
                        sx={{
                           color: '#005eb8',
                           fontWeight: 600,
                           fontSize: '0.875rem',
                           '&:hover': { textDecoration: 'underline' },
                        }}
                     >
                        View History
                     </Button>
                  </Box>

                  {myBorrowedBooks.length === 0 ? (
                     <Card
                        elevation={0}
                        sx={{
                           bgcolor: 'white',
                           borderRadius: '12px',
                           p: 6,
                           textAlign: 'center',
                           boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
                        }}
                     >
                        <AutoStoriesIcon sx={{ fontSize: 64, color: '#e5e9eb', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                           No borrowed books
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                           Browse the catalog below and request your first book!
                        </Typography>
                     </Card>
                  ) : (
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {myBorrowedBooks.map(book => {
                           const daysRemaining = getDaysRemaining(book.dueDate);
                           const isOverdue = daysRemaining < 0;
                           const isDueSoon = daysRemaining <= 7 && daysRemaining >= 0;
                           
                           return (
                              <Card
                                 key={book.id}
                                 elevation={0}
                                 sx={{
                                    bgcolor: 'white',
                                    borderRadius: '12px',
                                    p: 3,
                                    boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
                                    borderLeft: '4px solid #005eb8',
                                 }}
                              >
                                 <Box
                                    sx={{
                                       display: 'flex',
                                       flexDirection: { xs: 'column', sm: 'row' },
                                       gap: 3,
                                    }}
                                 >
                                    <Box
                                       sx={{
                                          width: { xs: '100%', sm: 128 },
                                          height: 192,
                                          bgcolor: '#ebeef0',
                                          borderRadius: '8px',
                                          flexShrink: 0,
                                       }}
                                    />
                                    <Box sx={{ flex: 1 }}>
                                       <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                          <Typography
                                             sx={{
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.1em',
                                                color: 'text.secondary',
                                             }}
                                          >
                                             {book.genre || 'Fiction'} • {book.publicationYear || 'N/A'}
                                          </Typography>
                                          <Box
                                             sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                bgcolor: 'rgba(255, 255, 255, 0.8)',
                                                backdropFilter: 'blur(12px)',
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '9999px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: isOverdue ? '#ba1a1a' : isDueSoon ? '#ba1a1a' : '#1d6e25',
                                             }}
                                          >
                                             {isOverdue ? (
                                                <>
                                                   <AlarmIcon sx={{ fontSize: 14 }} />
                                                   Overdue
                                                </>
                                             ) : isDueSoon ? (
                                                <>
                                                   <AlarmIcon sx={{ fontSize: 14 }} />
                                                   Due in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
                                                </>
                                             ) : (
                                                <>
                                                   <CheckCircleIcon sx={{ fontSize: 14 }} />
                                                   Due in {daysRemaining} days
                                                </>
                                             )}
                                          </Box>
                                       </Box>
                                       <Typography
                                          sx={{
                                             fontFamily: '"Manrope", sans-serif',
                                             fontSize: '1.25rem',
                                             fontWeight: 700,
                                             mb: 0.5,
                                          }}
                                       >
                                          {book.title}
                                       </Typography>
                                       <Typography color="text.secondary" sx={{ fontSize: '0.875rem', fontWeight: 500, mb: 2 }}>
                                          {book.author}
                                       </Typography>
                                       <Box sx={{ mt: 3, display: 'flex', gap: 1.5 }}>
                                          <Button
                                             variant="contained"
                                             onClick={() => handleRenewBorrow(book)}
                                             sx={{
                                                background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                                                borderRadius: '9999px',
                                                px: 3,
                                                color: 'white',
                                                fontWeight: 700,
                                                fontSize: '0.875rem',
                                                textTransform: 'none',
                                                '&:hover': {
                                                   background: 'linear-gradient(135deg, #003d7a 0%, #004c9e 100%)',
                                                },
                                             }}
                                          >
                                             Renew Borrow
                                          </Button>
                                          <Button
                                             variant="outlined"
                                             onClick={() => handleMarkFinished(book)}
                                             sx={{
                                                bgcolor: '#e5e9eb',
                                                borderColor: 'transparent',
                                                color: 'text.primary',
                                                borderRadius: '9999px',
                                                px: 3,
                                                fontWeight: 700,
                                                fontSize: '0.875rem',
                                                textTransform: 'none',
                                                '&:hover': {
                                                   bgcolor: '#e0e3e5',
                                                   borderColor: 'transparent',
                                                },
                                             }}
                                          >
                                             Mark Finished
                                          </Button>
                                       </Box>
                                    </Box>
                                 </Box>
                              </Card>
                           );
                        })}
                     </Box>
                  )}
               </Grid>

               {/* Sidebar */}
               <Grid item xs={12} md={4}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                     {/* Reader Activity */}
                     <Card
                        elevation={0}
                        sx={{
                           bgcolor: '#f1f4f6',
                           borderRadius: '24px',
                           p: 4,
                        }}
                     >
                        <Typography
                           sx={{
                              fontFamily: '"Manrope", sans-serif',
                              fontSize: '1.125rem',
                              fontWeight: 700,
                              mb: 3,
                           }}
                        >
                           Reader Activity
                        </Typography>
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                           <Grid item xs={6}>
                              <Box
                                 sx={{
                                    bgcolor: 'white',
                                    p: 2,
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                 }}
                              >
                                 <Typography
                                    sx={{
                                       fontFamily: '"Manrope", sans-serif',
                                       fontSize: '2rem',
                                       fontWeight: 900,
                                       color: '#005eb8',
                                    }}
                                 >
                                    {myBorrowedBooks.length}
                                 </Typography>
                                 <Typography
                                    sx={{
                                       fontSize: '0.625rem',
                                       textTransform: 'uppercase',
                                       fontWeight: 700,
                                       color: 'text.secondary',
                                       letterSpacing: '0.05em',
                                    }}
                                 >
                                    Currently Reading
                                 </Typography>
                              </Box>
                           </Grid>
                           <Grid item xs={6}>
                              <Box
                                 sx={{
                                    bgcolor: 'white',
                                    p: 2,
                                    borderRadius: '16px',
                                    textAlign: 'center',
                                 }}
                              >
                                 <Typography
                                    sx={{
                                       fontFamily: '"Manrope", sans-serif',
                                       fontSize: '2rem',
                                       fontWeight: 900,
                                       color: '#1d6e25',
                                    }}
                                 >
                                    {availableBooks.length}
                                 </Typography>
                                 <Typography
                                    sx={{
                                       fontSize: '0.625rem',
                                       textTransform: 'uppercase',
                                       fontWeight: 700,
                                       color: 'text.secondary',
                                       letterSpacing: '0.05em',
                                    }}
                                 >
                                    Available Books
                                 </Typography>
                              </Box>
                           </Grid>
                        </Grid>
                        <Box
                           sx={{
                              bgcolor: 'rgba(0, 94, 184, 0.05)',
                              borderRadius: '16px',
                              p: 2,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 2,
                           }}
                        >
                           <AutoStoriesIcon sx={{ fontSize: 32, color: '#005eb8' }} />
                           <Box>
                              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700 }}>
                                 Top Genre
                              </Typography>
                              <Typography color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                 Philosophy & Arts
                              </Typography>
                           </Box>
                        </Box>
                     </Card>

                     {/* Suggested Curations */}
                     <Box>
                        <Typography
                           sx={{
                              fontFamily: '"Manrope", sans-serif',
                              fontSize: '1.125rem',
                              fontWeight: 700,
                              mb: 2,
                           }}
                        >
                           Suggested Curations
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                           {suggestedBooks.map((book, index) => (
                              <Box
                                 key={book.id}
                                 sx={{
                                    display: 'flex',
                                    gap: 2,
                                    cursor: 'pointer',
                                    '&:hover': {
                                       '& img': { transform: 'scale(1.05)' },
                                    },
                                 }}
                              >
                                 <Box
                                    sx={{
                                       width: 64,
                                       height: 80,
                                       bgcolor: '#ebeef0',
                                       borderRadius: '8px',
                                       overflow: 'hidden',
                                       flexShrink: 0,
                                       transition: 'transform 0.2s',
                                    }}
                                 />
                                 <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.3 }}>
                                       {book.title}
                                    </Typography>
                                    <Typography
                                       variant="caption"
                                       color="text.secondary"
                                       sx={{ display: 'block', mb: 1 }}
                                    >
                                       {book.author}
                                    </Typography>
                                    <Box
                                       sx={{
                                          display: 'inline-block',
                                          bgcolor:
                                             index === 0
                                                ? 'rgba(29, 110, 37, 0.1)'
                                                : 'rgba(186, 26, 26, 0.1)',
                                          color: index === 0 ? '#1d6e25' : '#ba1a1a',
                                          px: 1,
                                          py: 0.25,
                                          borderRadius: '4px',
                                          fontSize: '0.625rem',
                                          fontWeight: 700,
                                       }}
                                    >
                                       {index === 0 ? 'Available' : 'Waitlist Only'}
                                    </Box>
                                 </Box>
                              </Box>
                           ))}
                        </Box>
                     </Box>
                  </Box>
               </Grid>
            </Grid>

            {/* New Arrivals Section */}
            <Box sx={{ mt: 10 }}>
               <Box
                  sx={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'flex-end',
                     mb: 4,
                  }}
               >
                  <Box>
                     <Typography
                        variant="h4"
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 800,
                           letterSpacing: '-0.02em',
                        }}
                     >
                        New Arrivals
                     </Typography>
                     <Typography color="text.secondary">
                        Fresh editions added to the archives this week.
                     </Typography>
                  </Box>
                  <Button
                     endIcon={<ArrowForwardIcon />}
                     sx={{
                        bgcolor: '#e5e9eb',
                        color: 'text.primary',
                        px: 3,
                        py: 1,
                        borderRadius: '9999px',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        '&:hover': { bgcolor: '#e0e3e5', gap: 1.5 },
                     }}
                  >
                     Browse All
                  </Button>
               </Box>
               <Box
                  sx={{
                     display: 'flex',
                     gap: 4,
                     overflowX: 'auto',
                     pb: 4,
                     '&::-webkit-scrollbar': { display: 'none' },
                  }}
               >
                  {newArrivals.map(book => (
                     <Box
                        key={book.id}
                        sx={{
                           minWidth: 240,
                           cursor: 'pointer',
                           '&:hover': {
                              '& .book-cover': { boxShadow: '0 12px 32px rgba(0,0,0,0.15)' },
                              '& .bookmark-btn': { opacity: 1 },
                           },
                        }}
                     >
                        <Box sx={{ position: 'relative', mb: 2 }}>
                           <Box
                              className="book-cover"
                              sx={{
                                 width: '100%',
                                 height: 320,
                                 bgcolor: '#ebeef0',
                                 borderRadius: '12px',
                                 boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                 transition: 'box-shadow 0.2s',
                              }}
                           />
                           <IconButton
                              className="bookmark-btn"
                              sx={{
                                 position: 'absolute',
                                 bottom: 16,
                                 right: 16,
                                 width: 48,
                                 height: 48,
                                 bgcolor: 'white',
                                 background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                                 color: 'white',
                                 opacity: 0,
                                 transition: 'opacity 0.2s',
                                 '&:hover': {
                                    transform: 'scale(0.9)',
                                 },
                              }}
                           >
                              <BookmarkAddIcon />
                           </IconButton>
                        </Box>
                        <Typography
                           sx={{
                              fontFamily: '"Manrope", sans-serif',
                              fontSize: '1.125rem',
                              fontWeight: 700,
                           }}
                        >
                           {book.title}
                        </Typography>
                        <Typography color="text.secondary" sx={{ fontSize: '0.875rem', mb: 2 }}>
                           {book.author}
                        </Typography>
                        <Button
                           fullWidth
                           variant="outlined"
                           onClick={() => handleRequestBorrow(book)}
                           sx={{
                              borderColor: 'rgba(194, 198, 212, 0.3)',
                              color: '#005eb8',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              '&:hover': {
                                 borderColor: '#005eb8',
                                 bgcolor: 'rgba(0, 94, 184, 0.05)',
                              },
                           }}
                        >
                           Request Borrow
                        </Button>
                     </Box>
                  ))}
               </Box>
            </Box>
            </>
            )}

            {activeTab === 'catalog' && (
               <>
                  {/* Catalog Header */}
                  <Box sx={{ mb: 6 }}>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box>
                           <Typography
                              variant="h3"
                              sx={{
                                 fontFamily: '"Manrope", sans-serif',
                                 fontWeight: 800,
                                 letterSpacing: '-0.02em',
                                 mb: 1,
                              }}
                           >
                              Book Catalog
                           </Typography>
                           <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
                              Browse all {availableBooks.filter(book => {
                                 if (!catalogSearchQuery) return true;
                                 const query = catalogSearchQuery.toLowerCase();
                                 return (
                                    book.title.toLowerCase().includes(query) ||
                                    book.author.toLowerCase().includes(query) ||
                                    book.isbn?.toLowerCase().includes(query) ||
                                    book.genre?.toLowerCase().includes(query)
                                 );
                              }).length} available books in our collection.
                           </Typography>
                        </Box>
                        <TextField
                           placeholder="Search by title, author, genre..."
                           value={catalogSearchQuery}
                           onChange={(e) => setCatalogSearchQuery(e.target.value)}
                           InputProps={{
                              startAdornment: (
                                 <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                 </InputAdornment>
                              ),
                           }}
                           sx={{
                              width: 320,
                              '& .MuiOutlinedInput-root': {
                                 borderRadius: '12px',
                                 bgcolor: 'white',
                              },
                           }}
                        />
                     </Box>
                  </Box>

                  {/* Catalog Grid */}
                  <Grid container spacing={3}>
                     {availableBooks
                        .filter(book => {
                           if (!catalogSearchQuery) return true;
                           const query = catalogSearchQuery.toLowerCase();
                           return (
                              book.title.toLowerCase().includes(query) ||
                              book.author.toLowerCase().includes(query) ||
                              book.isbn?.toLowerCase().includes(query) ||
                              book.genre?.toLowerCase().includes(query)
                           );
                        })
                        .map((book) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
                           <Card
                              elevation={0}
                              sx={{
                                 bgcolor: 'white',
                                 borderRadius: '16px',
                                 overflow: 'hidden',
                                 transition: 'all 0.3s',
                                 cursor: 'pointer',
                                 border: '1px solid #f1f4f6',
                                 height: '100%',
                                 display: 'flex',
                                 flexDirection: 'column',
                                 '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 20px 40px rgba(0, 71, 141, 0.15)',
                                    borderColor: '#d6e3ff',
                                 },
                              }}
                           >
                              <Box
                                 sx={{
                                    height: 240,
                                    bgcolor: '#ebeef0',
                                    position: 'relative',
                                    overflow: 'hidden',
                                 }}
                              >
                                 {book.coverImage && (
                                    <Box
                                       component="img"
                                       src={book.coverImage}
                                       alt={book.title}
                                       sx={{
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                       }}
                                    />
                                 )}
                                 <Box
                                    sx={{
                                       position: 'absolute',
                                       top: 12,
                                       right: 12,
                                       bgcolor: 'rgba(255, 255, 255, 0.95)',
                                       backdropFilter: 'blur(12px)',
                                       px: 1.5,
                                       py: 0.5,
                                       borderRadius: '9999px',
                                       fontSize: '0.75rem',
                                       fontWeight: 700,
                                       color: '#1d6e25',
                                    }}
                                 >
                                    Available
                                 </Box>
                              </Box>
                              <Box sx={{ p: 2.5, flex: 1, display: 'flex', flexDirection: 'column' }}>
                                 <Typography
                                    sx={{
                                       fontFamily: '"Manrope", sans-serif',
                                       fontSize: '0.625rem',
                                       fontWeight: 700,
                                       textTransform: 'uppercase',
                                       letterSpacing: '0.1em',
                                       color: 'text.secondary',
                                       mb: 1,
                                    }}
                                 >
                                    {book.genre || 'Fiction'} • {book.publicationYear || 'N/A'}
                                 </Typography>
                                 <Typography
                                    sx={{
                                       fontFamily: '"Manrope", sans-serif',
                                       fontSize: '1rem',
                                       fontWeight: 700,
                                       mb: 0.5,
                                       overflow: 'hidden',
                                       textOverflow: 'ellipsis',
                                       display: '-webkit-box',
                                       WebkitLineClamp: 2,
                                       WebkitBoxOrient: 'vertical',
                                    }}
                                 >
                                    {book.title}
                                 </Typography>
                                 <Typography 
                                    color="text.secondary" 
                                    sx={{ 
                                       fontSize: '0.875rem', 
                                       mb: 2,
                                       overflow: 'hidden',
                                       textOverflow: 'ellipsis',
                                       whiteSpace: 'nowrap',
                                    }}
                                 >
                                    {book.author}
                                 </Typography>
                                 <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handleRequestBorrow(book)}
                                    sx={{
                                       mt: 'auto',
                                       background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                                       color: 'white',
                                       borderRadius: '9999px',
                                       fontSize: '0.875rem',
                                       fontWeight: 700,
                                       textTransform: 'none',
                                       py: 1,
                                       '&:hover': {
                                          background: 'linear-gradient(135deg, #003d7a 0%, #004c9e 100%)',
                                       },
                                    }}
                                 >
                                    Request Borrow
                                 </Button>
                              </Box>
                           </Card>
                        </Grid>
                     ))}
                  </Grid>

                  {availableBooks.filter(book => {
                     if (!catalogSearchQuery) return true;
                     const query = catalogSearchQuery.toLowerCase();
                     return (
                        book.title.toLowerCase().includes(query) ||
                        book.author.toLowerCase().includes(query) ||
                        book.isbn?.toLowerCase().includes(query) ||
                        book.genre?.toLowerCase().includes(query)
                     );
                  }).length === 0 && (
                     <Card
                        elevation={0}
                        sx={{
                           bgcolor: 'white',
                           borderRadius: '12px',
                           p: 6,
                           textAlign: 'center',
                           boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
                        }}
                     >
                        <AutoStoriesIcon sx={{ fontSize: 64, color: '#e5e9eb', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                           {catalogSearchQuery ? 'No books found' : 'No books available'}
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                           {catalogSearchQuery 
                              ? 'Try different search terms or browse all books' 
                              : 'All books are currently checked out. Check back soon!'}
                        </Typography>
                     </Card>
                  )}
               </>
            )}

            {activeTab === 'history' && (
               <>
                  {/* History Header */}
                  <Box sx={{ mb: 6 }}>
                     <Typography
                        variant="h3"
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 800,
                           letterSpacing: '-0.02em',
                           mb: 1,
                        }}
                     >
                        Loan History
                     </Typography>
                     <Typography color="text.secondary" sx={{ maxWidth: 500 }}>
                        View your complete borrowing history and track your reading journey.
                     </Typography>
                  </Box>

                  {/* History Content */}
                  <LoanHistoryView />
               </>
            )}
         </Box>

         {/* Bottom Navigation (Mobile) */}
         <Box
            sx={{
               display: { xs: 'flex', md: 'none' },
               position: 'fixed',
               bottom: 0,
               left: 0,
               width: '100%',
               zIndex: 50,
               justifyContent: 'space-around',
               alignItems: 'center',
               px: 2,
               pb: 3,
               pt: 1.5,
               bgcolor: 'rgba(255, 255, 255, 0.9)',
               backdropFilter: 'blur(20px)',
               boxShadow: '0 -8px 24px rgba(0, 71, 141, 0.08)',
               borderTop: '1px solid #f1f4f6',
               borderRadius: '24px 24px 0 0',
            }}
         >
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  bgcolor: '#e3f2fd',
                  color: '#005eb8',
                  borderRadius: '16px',
                  px: 2.5,
                  py: 1,
               }}
            >
               <HomeIcon />
               <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, mt: 0.25 }}>Home</Typography>
            </Box>
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'text.secondary',
               }}
            >
               <SearchIcon />
               <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, mt: 0.25 }}>Search</Typography>
            </Box>
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'text.secondary',
               }}
            >
               <AutoStoriesIcon />
               <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, mt: 0.25 }}>
                  My Books
               </Typography>
            </Box>
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  color: 'text.secondary',
               }}
            >
               <PersonIcon />
               <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, mt: 0.25 }}>Profile</Typography>
            </Box>
         </Box>

         {/* CheckOut Dialog */}
         <CheckOutDialog
            open={checkOutDialogOpen}
            onClose={() => setCheckOutDialogOpen(false)}
            onCheckOut={handleCheckOut}
            bookTitle={selectedBook?.title || ''}
            borrowerName={user?.name || ''}
            borrowerEmail={user?.email || ''}
         />
      </Box>
   );
};

export default ReaderDashboard;
