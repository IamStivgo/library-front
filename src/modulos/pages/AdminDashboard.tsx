import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Box,
   Typography,
   Button,
   Card,
   Grid,
   IconButton,
   TextField,
   InputAdornment,
   Avatar,
   Pagination,
} from '@mui/material';
import {
   Dashboard as DashboardIcon,
   MenuBook as MenuBookIcon,
   Group as GroupIcon,
   Analytics as AnalyticsIcon,
   Description as DescriptionIcon,
   Help as HelpIcon,
   Logout as LogoutIcon,
   QrCodeScanner as QrCodeScannerIcon,
   Search as SearchIcon,
   Notifications as NotificationsIcon,
   Add as AddIcon,
   Edit as EditIcon,
   Delete as DeleteIcon,
   MoreVert as MoreVertIcon,
   ArrowForward as ArrowForwardIcon,
   LibraryBooks as LibraryBooksIcon,
   SyncAlt as SyncAltIcon,
   Warning as WarningIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAuth } from '../../context';
import { bookService } from '../../services';
import { Book } from '../../interface';
import { BookDialog } from '../../components/atoms';

const AdminDashboard = () => {
   const navigate = useNavigate();
   const { logout, user } = useAuth();
   const [searchQuery, setSearchQuery] = useState('');
   const [books, setBooks] = useState<Book[]>([]);
   const [loading, setLoading] = useState(true);
   const [bookDialogOpen, setBookDialogOpen] = useState(false);
   const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
   const [page, setPage] = useState(1);
   const booksPerPage = 10;

   useEffect(() => {
      loadBooks();
   }, []);

   const loadBooks = async () => {
      try {
         setLoading(true);
         const data = await bookService.getAllBooks();
         setBooks(data);
      } catch (err) {
         console.error('Error loading books:', err);
      } finally {
         setLoading(false);
      }
   };

   const handleLogout = () => {
      logout();
      navigate('/login');
   };

   const handleAddBook = () => {
      setSelectedBook(undefined);
      setBookDialogOpen(true);
   };

   const handleEditBook = (book: Book) => {
      setSelectedBook(book);
      setBookDialogOpen(true);
   };

   const handleSaveBook = async (bookData: Omit<Book, 'id'> | Book) => {
      try {
         if ('id' in bookData && bookData.id) {
            const updatedBook = await bookService.updateBook(bookData.id, bookData);
            setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
            await Swal.fire({
               icon: 'success',
               title: 'Success',
               text: 'The book has been updated successfully.',
               timer: 2000,
               showConfirmButton: false,
            });
         } else {
            const newBook = await bookService.createBook(bookData);
            setBooks(prev => [...prev, newBook]);
            await Swal.fire({
               icon: 'success',
               title: 'Success',
               text: 'The book has been added successfully.',
               timer: 2000,
               showConfirmButton: false,
            });
         }
         setBookDialogOpen(false);
         loadBooks(); // Recargar la lista
      } catch (err: any) {
         console.error('Error saving book:', err);
         await Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.response?.data?.message || 'Could not save the book. Please try again.',
            confirmButtonColor: '#005eb8',
         });
      }
   };

   const handleDeleteBook = async (book: Book) => {
      const result = await Swal.fire({
         title: 'Are you sure?',
         text: `Do you want to delete the book "${book.title}"?`,
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#d33',
         cancelButtonColor: '#3085d6',
         confirmButtonText: 'Yes, delete it',
         cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
         try {
            await bookService.deleteBook(book.id!);
            setBooks(prev => prev.filter(b => b.id !== book.id));
            await Swal.fire({
               icon: 'success',
               title: 'Deleted',
               text: 'The book has been deleted successfully.',
               timer: 2000,
               showConfirmButton: false,
            });
            loadBooks(); // Recargar la lista
         } catch (err) {
            console.error('Error deleting book:', err);
            await Swal.fire({
               icon: 'error',
               title: 'Error',
               text: 'Could not delete the book. Please try again.',
               confirmButtonColor: '#005eb8',
            });
         }
      }
   };

   const stats = {
      totalBooks: books.length,
      activeLoans: books.filter(b => b.status === 'checked-out').length,
      overdueBooks: 0, // Aquí podrías calcular libros vencidos
      growth: '+12%',
   };

   // Filtrar libros por búsqueda
   const filteredBooks = books.filter(book => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
         book.title.toLowerCase().includes(query) ||
         book.author.toLowerCase().includes(query) ||
         book.isbn.toLowerCase().includes(query) ||
         book.genre?.toLowerCase().includes(query) ||
         book.publisher?.toLowerCase().includes(query)
      );
   });

   // Calcular paginación
   const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
   const startIndex = (page - 1) * booksPerPage;
   const endIndex = startIndex + booksPerPage;
   const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

   const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
      // Scroll to top of book list
      window.scrollTo({ top: 400, behavior: 'smooth' });
   };

   return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7fafc' }}>
         {/* Sidebar */}
         <Box
            sx={{
               width: 256,
               position: 'fixed',
               left: 0,
               top: 0,
               height: '100vh',
               bgcolor: '#f1f4f6',
               display: 'flex',
               flexDirection: 'column',
               p: 2,
               gap: 1,
               borderRight: '1px solid #e5e9eb',
            }}
         >
            {/* Logo y perfil */}
            <Box sx={{ mb: 4, px: 1 }}>
               <Typography
                  sx={{
                     fontFamily: '"Manrope", sans-serif',
                     fontWeight: 800,
                     fontSize: '1.25rem',
                     color: '#005eb8',
                     mb: 1,
                  }}
               >
                  Lumina Ledger
               </Typography>
               <Card
                  elevation={0}
                  sx={{
                     mt: 3,
                     p: 1,
                     bgcolor: 'white',
                     borderRadius: '12px',
                     boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  }}
               >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                     <Avatar
                        sx={{ width: 40, height: 40, bgcolor: '#005eb8' }}
                        alt={user?.name || 'Admin'}
                     />
                     <Box>
                        <Typography
                           sx={{
                              fontFamily: '"Manrope", sans-serif',
                              fontWeight: 700,
                              fontSize: '0.875rem',
                           }}
                        >
                           {user?.name || 'Librarian Sarah'}
                        </Typography>
                        <Typography
                           sx={{
                              fontSize: '0.625rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.1em',
                              fontWeight: 600,
                              color: 'text.secondary',
                           }}
                        >
                           System Controller
                        </Typography>
                     </Box>
                  </Box>
               </Card>
            </Box>

            {/* Navigation */}
            <Box sx={{ flex: 1 }}>
               <Button
                  fullWidth
                  startIcon={<DashboardIcon />}
                  sx={{
                     justifyContent: 'flex-start',
                     px: 2,
                     py: 1.5,
                     mb: 0.5,
                     bgcolor: 'white',
                     color: '#005eb8',
                     borderRadius: '12px',
                     fontWeight: 600,
                     boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                     '&:hover': { bgcolor: 'white' },
                  }}
               >
                  Overview
               </Button>
               <Button
                  fullWidth
                  startIcon={<MenuBookIcon />}
                  sx={{
                     justifyContent: 'flex-start',
                     px: 2,
                     py: 1.5,
                     mb: 0.5,
                     color: 'text.secondary',
                     borderRadius: '12px',
                     '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  }}
               >
                  Inventory
               </Button>
               <Button
                  fullWidth
                  startIcon={<GroupIcon />}
                  sx={{
                     justifyContent: 'flex-start',
                     px: 2,
                     py: 1.5,
                     mb: 0.5,
                     color: 'text.secondary',
                     borderRadius: '12px',
                     '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  }}
               >
                  Members
               </Button>
               <Button
                  fullWidth
                  startIcon={<AnalyticsIcon />}
                  sx={{
                     justifyContent: 'flex-start',
                     px: 2,
                     py: 1.5,
                     mb: 0.5,
                     color: 'text.secondary',
                     borderRadius: '12px',
                     '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  }}
               >
                  Analytics
               </Button>
               <Button
                  fullWidth
                  startIcon={<DescriptionIcon />}
                  sx={{
                     justifyContent: 'flex-start',
                     px: 2,
                     py: 1.5,
                     color: 'text.secondary',
                     borderRadius: '12px',
                     '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  }}
               >
                  Reports
               </Button>
            </Box>

            {/* Bottom actions */}
            <Box sx={{ pt: 2, borderTop: '1px solid #e5e9eb' }}>
               <Button
                  fullWidth
                  startIcon={<QrCodeScannerIcon />}
                  variant="contained"
                  onClick={handleAddBook}
                  sx={{
                     mb: 1,
                     py: 1.5,
                     borderRadius: '9999px',
                     fontWeight: 600,
                     color: 'white',
                     background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                     boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
                     '&:hover': {
                        background: 'linear-gradient(135deg, #003d7a 0%, #004c9e 100%)',
                     },
                  }}
               >
                  Add New Book
               </Button>
               <Button
                  fullWidth
                  startIcon={<HelpIcon />}
                  sx={{
                     justifyContent: 'flex-start',
                     px: 2,
                     py: 1.5,
                     mb: 0.5,
                     color: 'text.secondary',
                     borderRadius: '12px',
                     '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' },
                  }}
               >
                  Support
               </Button>
               <Button
                  fullWidth
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                     justifyContent: 'flex-start',
                     px: 2,
                     py: 1.5,
                     color: '#ba1a1a',
                     borderRadius: '12px',
                     '&:hover': { bgcolor: 'rgba(186, 26, 26, 0.05)' },
                  }}
               >
                  Logout
               </Button>
            </Box>
         </Box>

         {/* Main Content */}
         <Box
            component="main"
            sx={{
               flexGrow: 1,
               ml: '256px',
               p: { xs: 4, lg: 6 },
            }}
         >
            {/* Header */}
            <Box
               sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { md: 'flex-end' },
                  gap: 3,
                  mb: 6,
               }}
            >
               <Box>
                  <Typography
                     sx={{
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'text.secondary',
                        mb: 0.5,
                     }}
                  >
                     Lumina Control Center
                  </Typography>
                  <Typography
                     variant="h3"
                     sx={{
                        fontFamily: '"Manrope", sans-serif',
                        fontWeight: 800,
                        letterSpacing: '-0.02em',
                     }}
                  >
                     System Overview
                  </Typography>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                     placeholder="Search catalog or members..."
                     value={searchQuery}
                     onChange={e => setSearchQuery(e.target.value)}
                     InputProps={{
                        startAdornment: (
                           <InputAdornment position="start">
                              <SearchIcon />
                           </InputAdornment>
                        ),
                     }}
                     sx={{
                        width: 256,
                        '& .MuiOutlinedInput-root': {
                           bgcolor: '#f1f4f6',
                           borderRadius: '12px',
                           border: 'none',
                        },
                     }}
                  />
                  <IconButton
                     sx={{
                        bgcolor: '#e5e9eb',
                        '&:hover': { bgcolor: '#e0e3e5' },
                     }}
                  >
                     <NotificationsIcon />
                  </IconButton>
               </Box>
            </Box>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
               <Grid item xs={12} md={6}>
                  <Card
                     elevation={0}
                     sx={{
                        bgcolor: 'rgba(0, 94, 184, 0.1)',
                        borderRadius: '24px',
                        p: 4,
                        border: '1px solid rgba(0, 71, 141, 0.05)',
                     }}
                  >
                     <LibraryBooksIcon sx={{ fontSize: 40, color: '#005eb8', mb: 2 }} />
                     <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500, mb: 2 }}
                     >
                        Total Books
                     </Typography>
                     <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                        <Typography
                           sx={{
                              fontFamily: '"Manrope", sans-serif',
                              fontSize: '3rem',
                              fontWeight: 900,
                              color: '#005eb8',
                           }}
                        >
                           {stats.totalBooks.toLocaleString()}
                        </Typography>
                        <Typography
                           sx={{ fontWeight: 700, fontSize: '0.875rem', color: '#1d6e25' }}
                        >
                           {stats.growth} this month
                        </Typography>
                     </Box>
                  </Card>
               </Grid>
               <Grid item xs={12} md={3}>
                  <Card
                     elevation={0}
                     sx={{
                        bgcolor: '#f1f4f6',
                        borderRadius: '24px',
                        p: 4,
                     }}
                  >
                     <SyncAltIcon sx={{ fontSize: 32, color: '#4c6074', mb: 2 }} />
                     <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500, mb: 2 }}
                     >
                        Active Loans
                     </Typography>
                     <Typography
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontSize: '2.5rem',
                           fontWeight: 700,
                        }}
                     >
                        {stats.activeLoans.toLocaleString()}
                     </Typography>
                  </Card>
               </Grid>
               <Grid item xs={12} md={3}>
                  <Card
                     elevation={0}
                     sx={{
                        bgcolor: 'rgba(186, 26, 26, 0.05)',
                        borderRadius: '24px',
                        p: 4,
                        border: '1px solid rgba(186, 26, 26, 0.05)',
                     }}
                  >
                     <WarningIcon sx={{ fontSize: 32, color: '#ba1a1a', mb: 2 }} />
                     <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500, mb: 2 }}
                     >
                        Overdue Books
                     </Typography>
                     <Typography
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontSize: '2.5rem',
                           fontWeight: 700,
                           color: '#ba1a1a',
                        }}
                     >
                        {stats.overdueBooks}
                     </Typography>
                  </Card>
               </Grid>
            </Grid>

            {/* Recent Inventory */}
            <Box sx={{ mb: 4 }}>
               <Box
                  sx={{
                     display: 'flex',
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     mb: 4,
                  }}
               >
                  <Box>
                     <Typography
                        variant="h5"
                        sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, mb: 1 }}
                     >
                        Recent Inventory
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredBooks.length)} of {filteredBooks.length} books
                     </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                     <Button
                        sx={{
                           bgcolor: '#f1f4f6',
                           color: 'text.primary',
                           px: 2,
                           py: 1,
                           borderRadius: '8px',
                           fontWeight: 600,
                           '&:hover': { bgcolor: '#e5e9eb' },
                        }}
                     >
                        Filter
                     </Button>
                     <Button
                        sx={{
                           bgcolor: '#f1f4f6',
                           color: 'text.primary',
                           px: 2,
                           py: 1,
                           borderRadius: '8px',
                           fontWeight: 600,
                           '&:hover': { bgcolor: '#e5e9eb' },
                        }}
                     >
                        Export CSV
                     </Button>
                  </Box>
               </Box>

               {/* Book List */}
               <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {!loading && paginatedBooks.length === 0 ? (
                     <Box
                        sx={{
                           textAlign: 'center',
                           py: 8,
                           bgcolor: 'white',
                           borderRadius: '16px',
                        }}
                     >
                        <MenuBookIcon sx={{ fontSize: 64, color: '#e5e9eb', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">
                           No books found
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                           {searchQuery ? 'Try different search terms' : 'Add your first book to get started'}
                        </Typography>
                     </Box>
                  ) : (
                     paginatedBooks.map(book => (
                        <Card
                           key={book.id}
                           elevation={0}
                           sx={{
                              bgcolor: 'white',
                              borderRadius: '16px',
                              p: 3,
                              boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
                              position: 'relative',
                              overflow: 'visible',
                              borderLeft: '4px solid #005eb8',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                 transform: 'translateY(-2px)',
                                 '& .action-buttons': {
                                    opacity: 1,
                                 },
                              },
                           }}
                        >
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                              <Box
                                 sx={{
                                    width: 64,
                                    height: 80,
                                    bgcolor: '#ebeef0',
                                    borderRadius: '8px',
                                    flexShrink: 0,
                                 }}
                              />
                              <Box sx={{ flex: 1 }}>
                                 <Typography
                                    sx={{
                                       fontFamily: '"Manrope", sans-serif',
                                       fontWeight: 700,
                                       fontSize: '1.125rem',
                                       mb: 0.5,
                                    }}
                                 >
                                    {book.title}
                                 </Typography>
                                 <Box sx={{ display: 'flex', gap: 2, mb: 0.5 }}>
                                    <Typography variant="body2" color="text.secondary">
                                       by {book.author}
                                    </Typography>
                                    <Typography
                                       variant="body2"
                                       sx={{ color: '#727783', fontSize: '0.75rem' }}
                                    >
                                       ISBN: {book.isbn}
                                    </Typography>
                                 </Box>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 4 }}>
                                 <Box
                                    sx={{
                                       bgcolor:
                                          book.status === 'checked-in'
                                             ? 'rgba(29, 110, 37, 0.1)'
                                             : 'rgba(147, 0, 10, 0.1)',
                                       color: book.status === 'checked-in' ? '#005412' : '#93000a',
                                       px: 2,
                                       py: 0.5,
                                       borderRadius: '6px',
                                       fontWeight: 700,
                                       fontSize: '0.75rem',
                                       textAlign: 'center',
                                    }}
                                 >
                                    {book.status === 'checked-in' ? 'Checked-in' : 'Checked-out'}
                                 </Box>
                                 <Typography
                                    variant="caption"
                                    sx={{ color: '#727783', fontSize: '0.75rem', textAlign: 'center' }}
                                 >
                                    {book.genre || 'No genre'}
                                 </Typography>
                              </Box>
                              <Box
                                 className="action-buttons"
                                 sx={{
                                    display: 'flex',
                                    gap: 1,
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                 }}
                              >
                                 <IconButton size="small" onClick={() => handleEditBook(book)}>
                                    <EditIcon />
                                 </IconButton>
                                 <IconButton size="small" color="error" onClick={() => handleDeleteBook(book)}>
                                    <DeleteIcon />
                                 </IconButton>
                                 <IconButton size="small">
                                    <MoreVertIcon />
                                 </IconButton>
                              </Box>
                           </Box>
                        </Card>
                     ))
                  )}
               </Box>

               {/* Pagination */}
               {totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                     <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        sx={{
                           '& .MuiPaginationItem-root': {
                              fontWeight: 600,
                              borderRadius: '8px',
                           },
                           '& .Mui-selected': {
                              background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                              color: 'white',
                              '&:hover': {
                                 background: 'linear-gradient(135deg, #003d7a 0%, #004c9e 100%)',
                              },
                           },
                        }}
                     />
                  </Box>
               )}
            </Box>

            {/* Bottom panels */}
            <Grid container spacing={4}>
               <Grid item xs={12} lg={8}>
                  <Card
                     elevation={0}
                     sx={{
                        bgcolor: '#f1f4f6',
                        borderRadius: '24px',
                        p: 4,
                     }}
                  >
                     <Typography
                        variant="h6"
                        sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, mb: 3 }}
                     >
                        Member Activity
                     </Typography>
                     <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Avatar sx={{ width: 40, height: 40 }} />
                              <Box>
                                 <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                                    David Smith
                                 </Typography>
                                 <Typography variant="caption" color="text.secondary">
                                    Returned "The Great Gatsby"
                                 </Typography>
                              </Box>
                           </Box>
                           <Typography
                              sx={{
                                 fontSize: '0.625rem',
                                 fontWeight: 700,
                                 textTransform: 'uppercase',
                                 color: '#727783',
                              }}
                           >
                              2m ago
                           </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                           <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                              <Avatar sx={{ width: 40, height: 40 }} />
                              <Box>
                                 <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                                    Sarah Jenkins
                                 </Typography>
                                 <Typography variant="caption" color="text.secondary">
                                    Checked out "Design Patterns"
                                 </Typography>
                              </Box>
                           </Box>
                           <Typography
                              sx={{
                                 fontSize: '0.625rem',
                                 fontWeight: 700,
                                 textTransform: 'uppercase',
                                 color: '#727783',
                              }}
                           >
                              15m ago
                           </Typography>
                        </Box>
                     </Box>
                     <Button
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                           mt: 4,
                           color: '#005eb8',
                           fontWeight: 700,
                           fontSize: '0.875rem',
                           '&:hover': { gap: 1.5 },
                        }}
                     >
                        Manage Members
                     </Button>
                  </Card>
               </Grid>
               <Grid item xs={12} lg={4}>
                  <Card
                     elevation={0}
                     sx={{
                        bgcolor: '#2d3133',
                        color: 'white',
                        borderRadius: '24px',
                        p: 4,
                     }}
                  >
                     <Typography
                        variant="h6"
                        sx={{ fontFamily: '"Manrope", sans-serif', fontWeight: 700, mb: 3 }}
                     >
                        Weekly Report
                     </Typography>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontSize: '0.875rem', opacity: 0.8 }}>Growth</Typography>
                        <Typography sx={{ fontWeight: 700 }}>+4.8%</Typography>
                     </Box>
                     <Box
                        sx={{
                           width: '100%',
                           height: 8,
                           bgcolor: 'rgba(255,255,255,0.1)',
                           borderRadius: '9999px',
                           overflow: 'hidden',
                           mb: 2,
                        }}
                     >
                        <Box
                           sx={{
                              width: '75%',
                              height: '100%',
                              bgcolor: '#a9c7ff',
                              borderRadius: '9999px',
                           }}
                        />
                     </Box>
                     <Typography variant="caption" sx={{ opacity: 0.6, lineHeight: 1.5, display: 'block', mb: 2 }}>
                        System performance is optimal. 12 new members registered this week,
                        exceeding the target by 15%.
                     </Typography>
                     <Button
                        fullWidth
                        variant="outlined"
                        sx={{
                           mt: 2,
                           borderColor: 'rgba(255,255,255,0.1)',
                           color: 'white',
                           borderRadius: '12px',
                           fontWeight: 700,
                           '&:hover': {
                              borderColor: 'rgba(255,255,255,0.2)',
                              bgcolor: 'rgba(255,255,255,0.05)',
                           },
                        }}
                     >
                        Download PDF
                     </Button>
                  </Card>
               </Grid>
            </Grid>
         </Box>

         {/* FAB */}
         <Button
            variant="contained"
            onClick={handleAddBook}
            sx={{
               position: 'fixed',
               bottom: 40,
               right: 40,
               width: 64,
               height: 64,
               minWidth: 64,
               borderRadius: '50%',
               background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
               boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
               '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 12px 32px rgba(0, 71, 141, 0.2)',
               },
               transition: 'all 0.2s',
            }}
         >
            <AddIcon sx={{ fontSize: 32 }} />
         </Button>

         {/* Book Dialog */}
         <BookDialog
            open={bookDialogOpen}
            onClose={() => setBookDialogOpen(false)}
            onSave={handleSaveBook}
            book={selectedBook}
         />
      </Box>
   );
};

export default AdminDashboard;
