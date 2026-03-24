import { useState, useEffect } from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   TextField,
   Grid,
   MenuItem,
   Box,
} from '@mui/material';
import { Book } from '../../interface';

interface BookDialogProps {
   open: boolean;
   onClose: () => void;
   onSave: (book: Omit<Book, 'id'> | Book) => void;
   book?: Book;
}

const currentYear = new Date().getFullYear();
const genres = [
   'Fiction',
   'Non-Fiction',
   'Science Fiction',
   'Fantasy',
   'Romance',
   'Mystery',
   'Thriller',
   'History',
   'Biography',
   'Science',
   'Technology',
   'Art',
   'Self-Help',
   'Children',
   'Young Adult',
   'Poetry',
   'Drama',
   'Adventure',
   'Horror',
   'Classic',
   'Other',
];

export const BookDialog = ({ open, onClose, onSave, book }: BookDialogProps) => {
   const [formData, setFormData] = useState<Omit<Book, 'id'>>({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publicationYear: currentYear,
      genre: '',
      description: '',
      status: 'checked-in',
   });

   useEffect(() => {
      if (book) {
         setFormData({
            title: book.title,
            author: book.author,
            isbn: book.isbn,
            publisher: book.publisher || '',
            publicationYear: book.publicationYear || currentYear,
            genre: book.genre || '',
            description: book.description || '',
            status: book.status,
         });
      } else {
         setFormData({
            title: '',
            author: '',
            isbn: '',
            publisher: '',
            publicationYear: currentYear,
            genre: '',
            description: '',
            status: 'checked-in',
         });
      }
   }, [book, open]);

   const handleChange = (field: keyof Omit<Book, 'id'>) => (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
   };

   const handleSubmit = () => {
      if (book?.id) {
         onSave({ ...formData, id: book.id });
      } else {
         onSave(formData);
      }
      onClose();
   };

   const isFormValid = formData.title && formData.author && formData.isbn;

   return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
         <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>
            {book ? 'Edit Book' : 'Add New Book'}
         </DialogTitle>
         <DialogContent>
            <Box sx={{ pt: 2 }}>
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        label="Title"
                        required
                        value={formData.title}
                        onChange={handleChange('title')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        label="Author"
                        required
                        value={formData.author}
                        onChange={handleChange('author')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        label="ISBN"
                        required
                        value={formData.isbn}
                        onChange={handleChange('isbn')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        label="Publisher"
                        value={formData.publisher}
                        onChange={handleChange('publisher')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        label="Publication Year"
                        type="number"
                        value={formData.publicationYear}
                        onChange={handleChange('publicationYear')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        select
                        label="Genre"
                        value={formData.genre}
                        onChange={handleChange('genre')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     >
                        {genres.map(genre => (
                           <MenuItem key={genre} value={genre}>
                              {genre}
                           </MenuItem>
                        ))}
                     </TextField>
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={handleChange('description')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
               </Grid>
            </Box>
         </DialogContent>
         <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
               onClick={onClose}
               sx={{
                  borderRadius: '9999px',
                  px: 3,
                  color: '#424752',
               }}
            >
               Cancel
            </Button>
            <Button
               onClick={handleSubmit}
               variant="contained"
               disabled={!isFormValid}
               sx={{
                  borderRadius: '9999px',
                  px: 4,
                  background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
               }}
            >
               {book ? 'Save Changes' : 'Add Book'}
            </Button>
         </DialogActions>
      </Dialog>
   );
};
