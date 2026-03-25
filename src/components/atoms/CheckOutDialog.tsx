import { useState, useEffect } from 'react';
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
   borrowerName: string;
   borrowerEmail: string;
}

export const CheckOutDialog = ({ 
   open, 
   onClose, 
   onCheckOut, 
   bookTitle, 
   borrowerName, 
   borrowerEmail 
}: CheckOutDialogProps) => {
   const [dueDate, setDueDate] = useState('');

   useEffect(() => {
      if (!open) {
         setDueDate('');
      }
   }, [open]);

   const handleSubmit = () => {
      onCheckOut({
         borrowerName,
         borrowerEmail,
         dueDate,
      });
      setDueDate('');
      onClose();
   };

   const isFormValid = dueDate !== '';

   const minDate = new Date().toISOString().split('T')[0];

   return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
         <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Check Out Book</DialogTitle>
         <DialogContent>
            <Box sx={{ pt: 2 }}>
               <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                  You are requesting: <strong>{bookTitle}</strong>
               </Typography>
               
               <Box sx={{ mb: 3, p: 2, bgcolor: '#f7fafc', borderRadius: '12px' }}>
                  <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                     Borrower Information:
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                     {borrowerName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                     {borrowerEmail}
                  </Typography>
               </Box>

               <Grid container spacing={3}>
                  <Grid item xs={12}>
                     <TextField
                        fullWidth
                        label="Due Date"
                        type="date"
                        required
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        InputLabelProps={{
                           shrink: true,
                        }}
                        inputProps={{
                           min: minDate,
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                        helperText="Select when you plan to return the book"
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
                  color: 'white',
                  background: 'linear-gradient(135deg, #00478d 0%, #005eb8 100%)',
                  '&:hover': {
                     background: 'linear-gradient(135deg, #003d7a 0%, #004c9e 100%)',
                  },
                  '&.Mui-disabled': {
                     background: '#e0e3e5',
                     color: 'rgba(0, 0, 0, 0.26)',
                  },
               }}
            >
               Check Out Book
            </Button>
         </DialogActions>
      </Dialog>
   );
};
