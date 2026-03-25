import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
   Box,
   Typography,
   Card,
   Grid,
   Chip,
} from '@mui/material';
import {
   CheckCircle as CheckCircleIcon,
   Alarm as AlarmIcon,
   AutoStories as AutoStoriesIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context';
import { loanHistoryService } from '../../services/loanHistoryService';
import { LoanHistory } from '../../interface';

const LoanHistoryView = () => {
   const { user } = useAuth();
   const [loanHistory, setLoanHistory] = useState<LoanHistory[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      loadHistory();
   }, [user]);

   const loadHistory = async () => {
      try {
         setLoading(true);
         const data = await loanHistoryService.getLoanHistory(user?.email);
         setLoanHistory(data);
      } catch (err) {
         console.error('Error loading loan history:', err);
      } finally {
         setLoading(false);
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case 'returned':
            return '#1d6e25';
         case 'active':
            return '#005eb8';
         case 'overdue':
            return '#ba1a1a';
         default:
            return '#616368';
      }
   };

   const getStatusIcon = (status: string) => {
      switch (status) {
         case 'returned':
            return <CheckCircleIcon sx={{ fontSize: 16 }} />;
         case 'overdue':
            return <AlarmIcon sx={{ fontSize: 16 }} />;
         default:
            return null;
      }
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
      });
   };

   if (loading) {
      return (
         <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography color="text.secondary">Loading history...</Typography>
         </Box>
      );
   }

   if (loanHistory.length === 0) {
      return (
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
               No loan history
            </Typography>
            <Typography variant="body2" color="text.disabled">
               You haven't borrowed any books yet.
            </Typography>
         </Card>
      );
   }

   return (
      <Grid container spacing={3}>
         {loanHistory.map((loan) => (
            <Grid item xs={12} key={loan.id}>
               <Card
                  elevation={0}
                  sx={{
                     bgcolor: 'white',
                     borderRadius: '16px',
                     p: 3,
                     boxShadow: '0 8px 24px rgba(0, 71, 141, 0.1)',
                     border: '1px solid #f1f4f6',
                     transition: 'all 0.3s',
                     '&:hover': {
                        boxShadow: '0 12px 32px rgba(0, 71, 141, 0.15)',
                        borderColor: '#d6e3ff',
                     },
                  }}
               >
                  <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
                     <Box
                        sx={{
                           width: 80,
                           height: 120,
                           bgcolor: '#ebeef0',
                           borderRadius: '8px',
                           flexShrink: 0,
                        }}
                     />
                     <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                           <Box>
                              <Typography
                                 sx={{
                                    fontFamily: '"Manrope", sans-serif',
                                    fontSize: '1.25rem',
                                    fontWeight: 700,
                                    mb: 0.5,
                                 }}
                              >
                                 {loan.bookTitle}
                              </Typography>
                              <Typography color="text.secondary" sx={{ fontSize: '0.875rem', mb: 2 }}>
                                 {loan.bookAuthor}
                              </Typography>
                           </Box>
                           <Chip
                              icon={getStatusIcon(loan.status)}
                              label={loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                              sx={{
                                 bgcolor: `${getStatusColor(loan.status)}15`,
                                 color: getStatusColor(loan.status),
                                 fontWeight: 700,
                                 fontSize: '0.75rem',
                                 '& .MuiChip-icon': {
                                    color: getStatusColor(loan.status),
                                 },
                              }}
                           />
                        </Box>
                        <Grid container spacing={2}>
                           <Grid item xs={6} sm={3}>
                              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                                 Checkout Date
                              </Typography>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                 {formatDate(loan.checkoutDate)}
                              </Typography>
                           </Grid>
                           <Grid item xs={6} sm={3}>
                              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                                 Due Date
                              </Typography>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                 {formatDate(loan.dueDate)}
                              </Typography>
                           </Grid>
                           {loan.returnDate && (
                              <Grid item xs={6} sm={3}>
                                 <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                                    Return Date
                                 </Typography>
                                 <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                    {formatDate(loan.returnDate)}
                                 </Typography>
                              </Grid>
                           )}
                           {loan.renewedCount > 0 && (
                              <Grid item xs={6} sm={3}>
                                 <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                                    Renewals
                                 </Typography>
                                 <Typography sx={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                    {loan.renewedCount}
                                 </Typography>
                              </Grid>
                           )}
                        </Grid>
                     </Box>
                  </Box>
               </Card>
            </Grid>
         ))}
      </Grid>
   );
};

export default LoanHistoryView;
