import { useState } from 'react';
import {
   Box,
   Paper,
   TextField,
   Button,
   Typography,
   Card,
   CardContent,
   CardActions,
   Grid,
   Chip,
   CircularProgress,
   Alert,
} from '@mui/material';
import { Search, AutoAwesome } from '@mui/icons-material';
import { aiService } from '../../services/ai.service';
import Swal from 'sweetalert2';

interface SemanticSearchResult {
   bookId: string;
   relevanceScore: number;
   reasoning: string;
   book: {
      id: string;
      title: string;
      author: string;
      genre?: string;
      description?: string;
   };
}

export const SemanticBookSearch = () => {
   const [query, setQuery] = useState('');
   const [results, setResults] = useState<SemanticSearchResult[]>([]);
   const [loading, setLoading] = useState(false);
   const [searched, setSearched] = useState(false);

   const handleSearch = async () => {
      if (!query.trim()) {
         Swal.fire('Attention', 'Please enter a search query', 'warning');
         return;
      }

      setLoading(true);
      setSearched(true);
      try {
         const data = await aiService.semanticSearch(query);
         setResults(data.results);
      } catch (error: any) {
         Swal.fire('Error', 'Could not perform semantic search', 'error');
         setResults([]);
      } finally {
         setLoading(false);
      }
   };

   const getRelevanceColor = (score: number) => {
      if (score >= 80) return 'success';
      if (score >= 60) return 'primary';
      if (score >= 40) return 'warning';
      return 'default';
   };

   return (
      <Box sx={{ p: 3 }}>
         <Typography variant="h4" mb={3} display="flex" alignItems="center">
            <AutoAwesome sx={{ mr: 1 }} /> Semantic Book Search
         </Typography>

         <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="body1" mb={2} color="text.secondary">
               Semantic search uses AI to understand the meaning of your query, not just keywords.
               Try phrases like "books about space adventures" or "romantic stories set in the Victorian era".
            </Typography>

            <Box display="flex" gap={2}>
               <TextField
                  fullWidth
                  label="What kind of book are you looking for?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Ex: books about personal growth and leadership"
                  multiline
                  rows={2}
               />
               <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={handleSearch}
                  disabled={loading}
                  sx={{ minWidth: 120 }}
               >
                  {loading ? <CircularProgress size={24} /> : 'Search'}
               </Button>
            </Box>
         </Paper>

         {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
               <CircularProgress />
            </Box>
         ) : searched && results.length === 0 ? (
            <Alert severity="info">
               No relevant books found for your search. Try a different query.
            </Alert>
         ) : (
            <Grid container spacing={3}>
               {results.map((result) => (
                  <Grid item xs={12} md={6} key={result.bookId}>
                     <Card elevation={3}>
                        <CardContent>
                           <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                              <Typography variant="h6">{result.book.title}</Typography>
                              <Chip
                                 label={`${result.relevanceScore}%`}
                                 color={getRelevanceColor(result.relevanceScore)}
                                 size="small"
                              />
                           </Box>

                           <Typography variant="subtitle2" color="text.secondary" mb={1}>
                              by {result.book.author}
                           </Typography>

                           {result.book.genre && (
                              <Chip label={result.book.genre} size="small" sx={{ mb: 2 }} />
                           )}

                           <Typography variant="body2" paragraph>
                              <strong>Why it's relevant:</strong> {result.reasoning}
                           </Typography>

                           {result.book.description && (
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                 {result.book.description.substring(0, 200)}...
                              </Typography>
                           )}
                        </CardContent>
                        <CardActions>
                           <Button size="small" color="primary">
                              View Details
                           </Button>
                        </CardActions>
                     </Card>
                  </Grid>
               ))}
            </Grid>
         )}
      </Box>
   );
};

export default SemanticBookSearch;
