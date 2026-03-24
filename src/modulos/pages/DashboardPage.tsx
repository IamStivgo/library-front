import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Box,
   AppBar,
   Toolbar,
   Typography,
   IconButton,
   Avatar,
   Drawer,
   List,
   ListItem,
   ListItemIcon,
   ListItemText,
   ListItemButton,
   TextField,
   InputAdornment,
   Button,
   Card,
   CardContent,
   Chip,
   Grid,
   useTheme,
   useMediaQuery,
   CircularProgress,
   Alert,
   MenuItem,
   Select,
   FormControl,
   InputLabel,
} from '@mui/material';
import {
   Menu as MenuIcon,
   Notifications as NotificationsIcon,
   Settings as SettingsIcon,
   Dashboard as DashboardIcon,
   MenuBook as MenuBookIcon,
   Group as GroupIcon,
   History as HistoryIcon,
   Inventory2 as InventoryIcon,
   QrCodeScanner as QrCodeScannerIcon,
   Help as HelpIcon,
   Logout as LogoutIcon,
   Search as SearchIcon,
   Add as AddIcon,
   Edit as EditIcon,
   Delete as DeleteIcon,
   AutoStories as AutoStoriesIcon,
} from '@mui/icons-material';
import Swal from 'sweetalert2';
import { useAuth } from '../../context';
import { bookService } from '../../services';
import { Book } from '../../interface';
import { BookDialog, CheckOutDialog } from '../../components/atoms';

const drawerWidth = 256;

const DashboardPage = () => {
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   const navigate = useNavigate();
   const { logout } = useAuth();
   const [mobileOpen, setMobileOpen] = useState(false);
   const [searchQuery, setSearchQuery] = useState('');
   const [statusFilter, setStatusFilter] = useState<'all' | 'checked-in' | 'checked-out'>('all');
   const [books, setBooks] = useState<Book[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [bookDialogOpen, setBookDialogOpen] = useState(false);
   const [checkOutDialogOpen, setCheckOutDialogOpen] = useState(false);
   const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

   useEffect(() => {
      loadBooks();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const loadBooks = async () => {
      try {
         setLoading(true);
         setError(null);
         const data = await bookService.getAllBooks();
         setBooks(data);
      } catch (err) {
         console.error('Error loading books:', err);
         setError('Could not load books. Using sample data.');
         setBooks(getMockBooks());
      } finally {
         setLoading(false);
      }
   };

   const getMockBooks = (): Book[] => [
      {
         id: 1,
         title: 'The Great Gatsby',
         author: 'F. Scott Fitzgerald',
         isbn: '978-0743273565',
         publisher: 'Scribner',
         publicationYear: 1925,
         genre: 'Classic',
         status: 'checked-in',
         description: 'A classic novel about the Jazz Age.',
      },
      {
         id: 2,
         title: '1984',
         author: 'George Orwell',
         isbn: '978-0451524935',
         publisher: 'Signet Classic',
         publicationYear: 1949,
         genre: 'Science Fiction',
         status: 'checked-out',
         borrowerName: 'John Doe',
         borrowerEmail: 'john@example.com',
         description: 'A dystopian novel about totalitarianism.',
      },
      {
         id: 3,
         title: 'Brave New World',
         author: 'Aldous Huxley',
         isbn: '978-0060850524',
         publisher: 'Harper Perennial',
         publicationYear: 1932,
         genre: 'Science Fiction',
         status: 'checked-in',
         description: 'A vision of the future controlled by technology.',
      },
   ];

   const filteredBooks = useMemo(() => {
      return books.filter(book => {
         const matchesSearch =
            searchQuery === '' ||
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.isbn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.publisher?.toLowerCase().includes(searchQuery.toLowerCase());

         const matchesStatus = statusFilter === 'all' || book.status === statusFilter;

         return matchesSearch && matchesStatus;
      });
   }, [books, searchQuery, statusFilter]);

   const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
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
      } catch (err) {
         console.error('Error saving book:', err);
         
         if ('id' in bookData && bookData.id) {
            setBooks(prev => prev.map(b => (b.id === bookData.id ? (bookData as Book) : b)));
         } else {
            const newBook: Book = {
               ...bookData,
               id: Math.max(0, ...books.map(b => b.id || 0)) + 1,
            };
            setBooks(prev => [...prev, newBook]);
         }
         
         await Swal.fire({
            icon: 'info',
            title: 'Local mode',
            text: 'Book saved locally (no server connection).',
            timer: 2000,
            showConfirmButton: false,
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
         } catch (err) {
            console.error('Error deleting book:', err);
            setBooks(prev => prev.filter(b => b.id !== book.id));
            await Swal.fire({
               icon: 'info',
               title: 'Local mode',
               text: 'Book deleted locally (no server connection).',
               timer: 2000,
               showConfirmButton: false,
            });
         }
      }
   };

   const handleCheckOut = (book: Book) => {
      setSelectedBook(book);
      setCheckOutDialogOpen(true);
   };

   const handleCheckOutConfirm = async (borrowerInfo: {
      borrowerName: string;
      borrowerEmail: string;
      dueDate: string;
   }) => {
      if (!selectedBook?.id) return;

      try {
         const updatedBook = await bookService.checkOutBook(selectedBook.id, borrowerInfo);
         setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
         await Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `The book "${selectedBook.title}" has been checked out to ${borrowerInfo.borrowerName}.`,
            timer: 2000,
            showConfirmButton: false,
         });
      } catch (err) {
         console.error('Error checking out book:', err);
         const updatedBook: Book = {
            ...selectedBook,
            status: 'checked-out',
            ...borrowerInfo,
            borrowDate: new Date().toISOString(),
         };
         setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
         await Swal.fire({
            icon: 'info',
            title: 'Local mode',
            text: 'Check-out recorded locally (no server connection).',
            timer: 2000,
            showConfirmButton: false,
         });
      }
   };

   const handleCheckIn = async (book: Book) => {
      const result = await Swal.fire({
         title: 'Return book?',
         text: `Confirm the return of "${book.title}"?`,
         icon: 'question',
         showCancelButton: true,
         confirmButtonColor: '#005eb8',
         cancelButtonColor: '#6c757d',
         confirmButtonText: 'Yes, return it',
         cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed && book.id) {
         try {
            const updatedBook = await bookService.checkInBook(book.id);
            setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
            await Swal.fire({
               icon: 'success',
               title: 'Returned',
               text: `The book "${book.title}" has been returned successfully.`,
               timer: 2000,
               showConfirmButton: false,
            });
         } catch (err) {
            console.error('Error checking in book:', err);
            const updatedBook: Book = {
               ...book,
               status: 'checked-in',
               borrowerName: undefined,
               borrowerEmail: undefined,
               borrowDate: undefined,
               dueDate: undefined,
            };
            setBooks(prev => prev.map(b => (b.id === updatedBook.id ? updatedBook : b)));
            await Swal.fire({
               icon: 'info',
               title: 'Local mode',
               text: 'Return recorded locally (no server connection).',
               timer: 2000,
               showConfirmButton: false,
            });
         }
      }
   };

   const drawer = (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f1f4f6' }}>
         <Box sx={{ p: 3, pb: 2 }}>
            <Typography
               variant="h6"
               sx={{
                  fontFamily: '"Manrope", sans-serif',
                  fontWeight: 800,
                  color: '#005eb8',
                  mb: 0.5,
               }}
            >
               The Archive
            </Typography>
            <Typography variant="caption" color="text.secondary">
               Main Branch
            </Typography>
         </Box>

         <List sx={{ flex: 1, px: 2 }}>
            <ListItem disablePadding>
               <ListItemButton
                  selected
                  sx={{
                     borderRadius: '0 9999px 9999px 0',
                     bgcolor: 'white',
                     '&.Mui-selected': {
                        bgcolor: 'white',
                        color: '#005eb8',
                        '&:hover': {
                           bgcolor: 'white',
                        },
                     },
                  }}
               >
                  <ListItemIcon sx={{ minWidth: 40, color: '#005eb8' }}>
                     <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
               </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
               <ListItemButton sx={{ borderRadius: '12px', mx: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                     <MenuBookIcon />
                  </ListItemIcon>
                  <ListItemText primary="Bookshelf" />
               </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
               <ListItemButton sx={{ borderRadius: '12px', mx: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                     <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="Borrowers" />
               </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
               <ListItemButton sx={{ borderRadius: '12px', mx: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                     <HistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="History" />
               </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
               <ListItemButton sx={{ borderRadius: '12px', mx: 1 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                     <InventoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Archived" />
               </ListItemButton>
            </ListItem>
         </List>

         <Box sx={{ p: 2, space: 1 }}>
            <Button
               fullWidth
               variant="contained"
               startIcon={<QrCodeScannerIcon />}
               sx={{
                  mb: 1,
                  py: 1.5,
                  borderRadius: '9999px',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
               }}
            >
               Quick Scan
            </Button>

            <ListItem disablePadding>
               <ListItemButton sx={{ borderRadius: '12px' }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                     <HelpIcon />
                  </ListItemIcon>
                  <ListItemText primary="Help" />
               </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
               <ListItemButton sx={{ borderRadius: '12px' }} onClick={handleLogout}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                     <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
               </ListItemButton>
            </ListItem>
         </Box>
      </Box>
   );

   return (
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7fafc' }}>
         <AppBar
            position="fixed"
            elevation={0}
            sx={{
               bgcolor: 'white',
               color: 'text.primary',
               borderBottom: '1px solid #e5e9eb',
               zIndex: theme.zIndex.drawer + 1,
            }}
         >
            <Toolbar>
               {isMobile && (
                  <IconButton
                     color="inherit"
                     edge="start"
                     onClick={handleDrawerToggle}
                     sx={{ mr: 2 }}
                  >
                     <MenuIcon />
                  </IconButton>
               )}

               <Typography
                  variant="h6"
                  sx={{
                     fontFamily: '"Manrope", sans-serif',
                     fontWeight: 700,
                     color: '#005eb8',
                     flexGrow: 1,
                  }}
               >
                  Digital Curator
               </Typography>

               <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <IconButton color="inherit">
                     <NotificationsIcon />
                  </IconButton>
                  <IconButton color="inherit">
                     <SettingsIcon />
                  </IconButton>
                  <Box sx={{ width: 1, height: 32, bgcolor: 'divider', mx: 1 }} />
                  <Avatar
                     sx={{ width: 32, height: 32, bgcolor: '#005eb8' }}
                     alt="User"
                     src="https://i.pravatar.cc/150?img=12"
                  />
               </Box>
            </Toolbar>
         </AppBar>

         <Box
            component="nav"
            sx={{
               width: { md: drawerWidth },
               flexShrink: { md: 0 },
            }}
         >
            <Drawer
               variant={isMobile ? 'temporary' : 'permanent'}
               open={isMobile ? mobileOpen : true}
               onClose={handleDrawerToggle}
               ModalProps={{
                  keepMounted: true,
               }}
               sx={{
                  '& .MuiDrawer-paper': {
                     width: drawerWidth,
                     boxSizing: 'border-box',
                     border: 'none',
                     mt: { md: '64px' },
                     height: { md: 'calc(100vh - 64px)' },
                  },
               }}
            >
               {drawer}
            </Drawer>
         </Box>

         <Box
            component="main"
            sx={{
               flexGrow: 1,
               p: { xs: 2, md: 6 },
               width: { md: `calc(100% - ${drawerWidth}px)` },
               mt: '64px',
            }}
         >
            <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
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
                        variant="caption"
                        sx={{
                           textTransform: 'uppercase',
                           letterSpacing: '0.1em',
                           color: 'text.secondary',
                           fontWeight: 600,
                           mb: 1,
                           display: 'block',
                        }}
                     >
                        Library Overview
                     </Typography>
                     <Typography
                        variant="h3"
                        sx={{
                           fontFamily: '"Manrope", sans-serif',
                           fontWeight: 800,
                           letterSpacing: '-0.02em',
                        }}
                     >
                        Main Collection
                     </Typography>
                     <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {filteredBooks.length} book(s) found
                     </Typography>
                  </Box>

                  <Button
                     variant="contained"
                     startIcon={<AddIcon />}
                     onClick={handleAddBook}
                     sx={{
                        py: 1.5,
                        px: 4,
                        borderRadius: '9999px',
                        fontWeight: 600,
                        background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                        boxShadow: '0 4px 12px rgba(0, 71, 141, 0.2)',
                     }}
                  >
                     Add New Book
                  </Button>
               </Box>

               {error && (
                  <Alert severity="warning" sx={{ mb: 3, borderRadius: '12px' }}>
                     {error}
                  </Alert>
               )}

               <Box sx={{ mb: 6 }}>
                  <Grid container spacing={2}>
                     <Grid item xs={12} md={8}>
                        <TextField
                           fullWidth
                           placeholder="Search by title, author, ISBN, genre or publisher..."
                           value={searchQuery}
                           onChange={e => setSearchQuery(e.target.value)}
                           InputProps={{
                              startAdornment: (
                                 <InputAdornment position="start">
                                    <SearchIcon />
                                 </InputAdornment>
                              ),
                              endAdornment: (
                                 <InputAdornment position="end">
                                    <Typography
                                       variant="caption"
                                       sx={{
                                          bgcolor: '#e5e9eb',
                                          px: 1,
                                          py: 0.5,
                                          borderRadius: '4px',
                                          fontWeight: 700,
                                       }}
                                    >
                                       ⌘K
                                    </Typography>
                                 </InputAdornment>
                              ),
                           }}
                           sx={{
                              '& .MuiOutlinedInput-root': {
                                 bgcolor: '#f1f4f6',
                                 borderRadius: '12px',
                              },
                           }}
                        />
                     </Grid>
                     <Grid item xs={12} md={4}>
                        <FormControl fullWidth>
                           <InputLabel>Status</InputLabel>
                           <Select
                              value={statusFilter}
                              label="Status"
                              onChange={e =>
                                 setStatusFilter(
                                    e.target.value as 'all' | 'checked-in' | 'checked-out'
                                 )
                              }
                              sx={{
                                 bgcolor: '#f1f4f6',
                                 borderRadius: '12px',
                              }}
                           >
                              <MenuItem value="all">All</MenuItem>
                              <MenuItem value="checked-in">Available</MenuItem>
                              <MenuItem value="checked-out">Checked Out</MenuItem>
                           </Select>
                        </FormControl>
                     </Grid>
                  </Grid>
               </Box>

               {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                     <CircularProgress />
                  </Box>
               ) : (
                  <Grid container spacing={3}>
                     {filteredBooks.length === 0 ? (
                        <Grid item xs={12}>
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
                                 Try with different search terms
                              </Typography>
                           </Box>
                        </Grid>
                     ) : (
                        filteredBooks.map(book => (
                           <Grid item xs={12} key={book.id}>
                              <Card
                                 elevation={0}
                                 sx={{
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    bgcolor: book.status === 'checked-in' ? 'white' : '#f1f4f6',
                                    border: '1px solid transparent',
                                    borderLeftWidth: '4px',
                                    borderLeftColor:
                                       book.status === 'checked-in'
                                          ? '#005eb8'
                                          : 'rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                       boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                                    },
                                 }}
                              >
                                 <CardContent sx={{ p: 3 }}>
                                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                                       <Box
                                          sx={{
                                             width: 80,
                                             height: 100,
                                             borderRadius: '8px',
                                             bgcolor: '#ebeef0',
                                             display: 'flex',
                                             alignItems: 'center',
                                             justifyContent: 'center',
                                             position: 'relative',
                                             flexShrink: 0,
                                          }}
                                       >
                                          <AutoStoriesIcon
                                             sx={{ fontSize: 40, color: 'rgba(0, 0, 0, 0.1)' }}
                                          />
                                          <Chip
                                             label={
                                                book.status === 'checked-in' ? 'In Stock' : 'Out'
                                             }
                                             size="small"
                                             sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor:
                                                   book.status === 'checked-in'
                                                      ? 'rgba(29, 110, 37, 0.1)'
                                                      : 'rgba(186, 26, 26, 0.1)',
                                                color:
                                                   book.status === 'checked-in'
                                                      ? '#1d6e25'
                                                      : '#ba1a1a',
                                                fontWeight: 700,
                                                fontSize: '0.625rem',
                                             }}
                                          />
                                       </Box>

                                       <Box sx={{ flex: 1 }}>
                                          <Grid container spacing={3} alignItems="center">
                                             <Grid item xs={12} md={5}>
                                                <Typography
                                                   variant="h6"
                                                   sx={{
                                                      fontFamily: '"Manrope", sans-serif',
                                                      fontWeight: 700,
                                                      mb: 0.5,
                                                   }}
                                                >
                                                   {book.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                   {book.author}
                                                </Typography>
                                                <Typography variant="caption" color="text.disabled">
                                                   ISBN: {book.isbn}
                                                </Typography>
                                                {book.genre && (
                                                   <Typography
                                                      variant="caption"
                                                      color="text.disabled"
                                                      sx={{ display: 'block', mt: 0.5 }}
                                                   >
                                                      Genre: {book.genre}
                                                   </Typography>
                                                )}
                                                {book.status === 'checked-out' && book.borrowerName && (
                                                   <Typography
                                                      variant="caption"
                                                      color="error"
                                                      sx={{ display: 'block', mt: 1 }}
                                                   >
                                                      Borrowed by: {book.borrowerName}
                                                   </Typography>
                                                )}
                                             </Grid>

                                             <Grid item xs={12} md={3}>
                                                <Chip
                                                   label={
                                                      book.status === 'checked-in'
                                                         ? 'Available'
                                                         : 'Checked Out'
                                                   }
                                                   icon={
                                                      <Box
                                                         sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            bgcolor:
                                                               book.status === 'checked-in'
                                                                  ? '#005412'
                                                                  : '#ba1a1a',
                                                         }}
                                                      />
                                                   }
                                                   sx={{
                                                      bgcolor:
                                                         book.status === 'checked-in'
                                                            ? 'rgba(29, 110, 37, 0.1)'
                                                            : 'rgba(186, 26, 26, 0.1)',
                                                      color:
                                                         book.status === 'checked-in'
                                                            ? '#1d6e25'
                                                            : '#93000a',
                                                      fontWeight: 600,
                                                   }}
                                                />
                                             </Grid>

                                             <Grid item xs={12} md={4}>
                                                <Box
                                                   sx={{
                                                      display: 'flex',
                                                      gap: 1,
                                                      justifyContent: 'flex-end',
                                                   }}
                                                >
                                                   <IconButton
                                                      size="small"
                                                      onClick={() => handleEditBook(book)}
                                                   >
                                                      <EditIcon />
                                                   </IconButton>
                                                   <IconButton
                                                      size="small"
                                                      color="error"
                                                      onClick={() => handleDeleteBook(book)}
                                                   >
                                                      <DeleteIcon />
                                                   </IconButton>
                                                   <Button
                                                      variant="contained"
                                                      size="small"
                                                      onClick={() =>
                                                         book.status === 'checked-in'
                                                            ? handleCheckOut(book)
                                                            : handleCheckIn(book)
                                                      }
                                                      sx={{
                                                         borderRadius: '9999px',
                                                         px: 3,
                                                         bgcolor:
                                                            book.status === 'checked-in'
                                                               ? '#1d6e25'
                                                               : '#005eb8',
                                                         color: 'white',
                                                         fontWeight: 600,
                                                         '&:hover': {
                                                            bgcolor:
                                                               book.status === 'checked-in'
                                                                  ? '#005412'
                                                                  : '#00478d',
                                                         },
                                                      }}
                                                   >
                                                      {book.status === 'checked-in'
                                                         ? 'Check Out'
                                                         : 'Check In'}
                                                   </Button>
                                                </Box>
                                             </Grid>
                                          </Grid>
                                       </Box>
                                    </Box>
                                 </CardContent>
                              </Card>
                           </Grid>
                        ))
                     )}
                  </Grid>
               )}
            </Box>
         </Box>

         <BookDialog
            open={bookDialogOpen}
            onClose={() => setBookDialogOpen(false)}
            onSave={handleSaveBook}
            book={selectedBook}
         />

         <CheckOutDialog
            open={checkOutDialogOpen}
            onClose={() => setCheckOutDialogOpen(false)}
            onCheckOut={handleCheckOutConfirm}
            bookTitle={selectedBook?.title || ''}
         />
      </Box>
   );
};

export default DashboardPage;
