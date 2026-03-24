import { useState } from 'react';
import {
   Dialog,
   DialogTitle,
   DialogContent,
   DialogActions,
   Button,
   TextField,
   Grid,
   Box,
   Typography,
} from '@mui/material';

interface CheckOutDialogProps {
   open: boolean;
   onClose: () => void;
   onCheckOut: (borrowerInfo: {
      borrowerName: string;
      borrowerEmail: string;
      dueDate: string;
   }) => void;
   bookTitle: string;
}

export const CheckOutDialog = ({ open, onClose, onCheckOut, bookTitle }: CheckOutDialogProps) => {
   const [formData, setFormData] = useState({
      borrowerName: '',
      borrowerEmail: '',
      dueDate: '',
   });

   const handleChange = (field: keyof typeof formData) => (
      e: React.ChangeEvent<HTMLInputElement>
   ) => {
      setFormData(prev => ({ ...prev, [field]: e.target.value }));
   };

   const handleSubmit = () => {
      onCheckOut(formData);
      setFormData({ borrowerName: '', borrowerEmail: '', dueDate: '' });
      onClose();
   };

   const isFormValid =
      formData.borrowerName && formData.borrowerEmail && formData.dueDate;

   const minDate = new Date().toISOString().split('T')[0];

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Check Out Book</DialogTitle>
         <DialogContent>
            <Box sx={{ pt: 2 }}>
               <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  <strong>{bookTitle}</strong>
               </Typography>
               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        label="Borrower's Name"
                        required
                        value={formData.borrowerName}
                        onChange={handleChange('borrowerName')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        label="Borrower's Email"
                        type="email"
                        required
                        value={formData.borrowerEmail}
                        onChange={handleChange('borrowerEmail')}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                     />
                  </Grid>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        required
                        value={formData.dueDate}
                        onChange={handleChange('dueDate')}
                        InputLabelProps={{
                           shrink: true,
                        }}
                        inputProps={{
                           min: minDate,
                        }}
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
               Check Out Book
            </Button>
         </DialogActions>
      </Dialog>
   );
};
