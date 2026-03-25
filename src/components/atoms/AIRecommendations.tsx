import { useState } from 'react';
import {
   Box,
   Paper,
   Typography,
   Button,
   Chip,
   TextField,
   Grid,
   Card,
   CardContent,
   CircularProgress,
   Stack,
} from '@mui/material';
import {
   AutoAwesome as SparklesIcon,
   Book as BookIcon,
   Person as PersonIcon,
   Category as CategoryIcon,
} from '@mui/icons-material';
import { aiService, BookRecommendation, RecommendationPreferences } from '../../services/ai.service';

const AIRecommendations = () => {
   const [loading, setLoading] = useState(false);
   const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
   const [preferences, setPreferences] = useState<RecommendationPreferences>({
      favoriteGenres: [],
      favoriteAuthors: [],
      recentReads: [],
      interests: [],
   });
   const [currentInput, setCurrentInput] = useState('');
   const [currentField, setCurrentField] = useState<keyof RecommendationPreferences>('favoriteGenres');

   const handleAddItem = () => {
      if (!currentInput.trim()) return;

      setPreferences((prev) => ({
         ...prev,
         [currentField]: [...(prev[currentField] || []), currentInput.trim()],
      }));
      setCurrentInput('');
   };

   const handleRemoveItem = (field: keyof RecommendationPreferences, index: number) => {
      setPreferences((prev) => ({
         ...prev,
         [field]: prev[field]?.filter((_, i) => i !== index) || [],
      }));
   };

   const handleGetRecommendations = async () => {
      setLoading(true);
      try {
         const results = await aiService.getRecommendations(preferences);
         setRecommendations(results);
      } catch (error) {
         console.error('Error getting recommendations:', error);
      } finally {
         setLoading(false);
      }
   };

   const fieldLabels = {
      favoriteGenres: 'Favorite Genres',
      favoriteAuthors: 'Favorite Authors',
      recentReads: 'Recent Reads',
      interests: 'Interests',
   };

   const fieldIcons = {
      favoriteGenres: <CategoryIcon />,
      favoriteAuthors: <PersonIcon />,
      recentReads: <BookIcon />,
      interests: <SparklesIcon />,
   };

   return (
      <Box>
         <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: '16px' }}>
            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
               <SparklesIcon color="primary" />
               Get Personalized Recommendations
            </Typography>

            <Grid container spacing={3}>
               {Object.entries(fieldLabels).map(([field, label]) => (
                  <Grid item xs={12} md={6} key={field}>
                     <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                           {fieldIcons[field as keyof typeof fieldIcons]}
                           {label}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                           <TextField
                              fullWidth
                              size="small"
                              value={currentField === field ? currentInput : ''}
                              onChange={(e) => {
                                 setCurrentField(field as keyof RecommendationPreferences);
                                 setCurrentInput(e.target.value);
                              }}
                              onKeyPress={(e) => {
                                 if (e.key === 'Enter') {
                                    setCurrentField(field as keyof RecommendationPreferences);
                                    handleAddItem();
                                 }
                              }}
                              placeholder={`Add ${label.toLowerCase()}`}
                           />
                           <Button
                              variant="contained"
                              size="small"
                              onClick={() => {
                                 setCurrentField(field as keyof RecommendationPreferences);
                                 handleAddItem();
                              }}
                              disabled={currentField !== field || !currentInput.trim()}
                           >
                              +
                           </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                           {preferences[field as keyof RecommendationPreferences]?.map((item, index) => (
                              <Chip
                                 key={index}
                                 label={item}
                                 onDelete={() => handleRemoveItem(field as keyof RecommendationPreferences, index)}
                                 size="small"
                                 color="primary"
                                 variant="outlined"
                              />
                           ))}
                        </Box>
                     </Box>
                  </Grid>
               ))}
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
               <Button
                  variant="contained"
                  size="large"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SparklesIcon />}
                  onClick={handleGetRecommendations}
                  disabled={loading}
                  sx={{ minWidth: 200 }}
               >
                  {loading ? 'Generating...' : 'Get Recommendations'}
               </Button>
            </Box>
         </Paper>

         {recommendations.length > 0 && (
            <Box>
               <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
                  Recommendations for you
               </Typography>
               <Grid container spacing={3}>
                  {recommendations.map((rec, index) => (
                     <Grid item xs={12} md={6} key={index}>
                        <Card
                           elevation={2}
                           sx={{
                              height: '100%',
                              borderRadius: '16px',
                              transition: 'transform 0.2s',
                              '&:hover': {
                                 transform: 'translateY(-4px)',
                              },
                           }}
                        >
                           <CardContent>
                              <Stack spacing={2}>
                                 <Box>
                                    <Typography variant="h6" gutterBottom>
                                       {rec.title}
                                    </Typography>
                                    {rec.author && (
                                       <Typography variant="body2" color="text.secondary">
                                          by {rec.author}
                                       </Typography>
                                    )}
                                    {rec.genre && (
                                       <Chip
                                          label={rec.genre}
                                          size="small"
                                          color="primary"
                                          variant="outlined"
                                          sx={{ mt: 1 }}
                                       />
                                    )}
                                 </Box>
                                 <Typography variant="body2" color="text.secondary">
                                    {rec.reasoning}
                                 </Typography>
                              </Stack>
                           </CardContent>
                        </Card>
                     </Grid>
                  ))}
               </Grid>
            </Box>
         )}
      </Box>
   );
};

export default AIRecommendations;
