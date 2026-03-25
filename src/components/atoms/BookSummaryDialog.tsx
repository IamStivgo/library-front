import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, CircularProgress, Typography } from '@mui/material';
import { AutoAwesome as SparklesIcon } from '@mui/icons-material';
import { aiService } from '../../services/ai.service';

interface BookSummaryDialogProps {
   bookId: string;
   bookTitle: string;
   open: boolean;
   onClose: () => void;
}

const BookSummaryDialog = ({ bookId, bookTitle, open, onClose }: BookSummaryDialogProps) => {
   const [summary, setSummary] = useState<string>('');
   const [loading, setLoading] = useState(false);

   const handleGenerateSummary = async () => {
      setLoading(true);
      try {
         const result = await aiService.getBookSummary(bookId);
         setSummary(result);
      } catch (error) {
         console.error('Error generating summary:', error);
         setSummary('Error generating summary. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleClose = () => {
      setSummary('');
      onClose();
   };

   return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
         <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SparklesIcon color="primary" />
            AI Summary: {bookTitle}
         </DialogTitle>
         <DialogContent>
            {!summary && !loading && (
               <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                     Generate a detailed summary of this book with AI
                  </Typography>
                  <Button
                     variant="contained"
                     startIcon={<SparklesIcon />}
                     onClick={handleGenerateSummary}
                     sx={{ mt: 2 }}
                  >
                     Generate Summary
                  </Button>
               </Box>
            )}

            {loading && (
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4, gap: 2 }}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary">
                     Generating summary...
                  </Typography>
               </Box>
            )}

            {summary && !loading && (
               <Box sx={{ py: 2 }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                     {summary}
                  </Typography>
               </Box>
            )}
         </DialogContent>
      </Dialog>
   );
};

export default BookSummaryDialog;
