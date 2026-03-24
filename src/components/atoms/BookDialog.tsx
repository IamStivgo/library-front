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

   const [errors, setErrors] = useState<{
      title?: string;
      author?: string;
      isbn?: string;
      publisher?: string;
      publicationYear?: string;
      description?: string;
   }>({});

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
      setErrors({});
   }, [book, open]);

   const validateField = (field: keyof Omit<Book, 'id'>, value: any): string | undefined => {
      switch (field) {
         case 'title':
            if (!value || value.trim().length === 0) return 'Title is required';
            if (value.length > 255) return 'Title must be less than 255 characters';
            break;
         case 'author':
            if (!value || value.trim().length === 0) return 'Author is required';
            if (value.length > 255) return 'Author must be less than 255 characters';
            break;
         case 'isbn':
            if (!value || value.trim().length === 0) return 'ISBN is required';
            if (value.length < 10) return 'ISBN must be at least 10 characters long';
            if (value.length > 17) return 'ISBN must be less than 17 characters';
            break;
         case 'publisher':
            if (value && value.length > 255) return 'Publisher must be less than 255 characters';
            break;
         case 'publicationYear':
            if (value) {
               const year = Number(value);
               if (year < 1000) return 'Year must be at least 1000';
               if (year > currentYear) return `Year cannot be greater than ${currentYear}`;
            }
            break;
         case 'description':
            if (value && value.length > 1000) return 'Description must be less than 1000 characters';
            break;
      }
      return undefined;
   };

   const handleChange = (field: keyof Omit<Book, 'id'>) => (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      const value = e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
      
      // Validar el campo en tiempo real
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
   };

   const handleSubmit = () => {
      // Validar todos los campos antes de enviar
      const newErrors: typeof errors = {};
      let hasErrors = false;

      (Object.keys(formData) as Array<keyof Omit<Book, 'id'>>).forEach(field => {
         const error = validateField(field, formData[field]);
         if (error) {
            newErrors[field as keyof typeof errors] = error;
            hasErrors = true;
         }
      });

      setErrors(newErrors);

      if (hasErrors) {
         return;
      }

      if (book?.id) {
         onSave({ ...formData, id: book.id });
      } else {
         onSave(formData);
      }
      onClose();
   };

   const isFormValid = 
      formData.title && 
      formData.author && 
      formData.isbn && 
      formData.isbn.length >= 10 &&
      !errors.title &&
      !errors.author &&
      !errors.isbn &&
      !errors.publisher &&
      !errors.publicationYear &&
      !errors.description;

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
                        error={!!errors.title}
                        helperText={errors.title}
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
                        error={!!errors.author}
                        helperText={errors.author}
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
                        error={!!errors.isbn}
                        helperText={errors.isbn || 'Minimum 10 characters'}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12} md={6}>
                     <TextField
                        fullWidth
                        label="Publisher"
                        value={formData.publisher}
                        onChange={handleChange('publisher')}
                        error={!!errors.publisher}
                        helperText={errors.publisher}
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
                        error={!!errors.publicationYear}
                        helperText={errors.publicationYear}
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
                        error={!!errors.description}
                        helperText={errors.description}
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
