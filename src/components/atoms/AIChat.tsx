import { useState } from 'react';
import {
   Box,
   Paper,
   Typography,
   TextField,
   IconButton,
   List,
   ListItem,
   ListItemText,
   Avatar,
   CircularProgress,
   Chip,
} from '@mui/material';
import { Send as SendIcon, SmartToy as BotIcon, Person as PersonIcon } from '@mui/icons-material';
import { aiService, ChatMessage } from '../../services/ai.service';

interface AIChatProps {
   includeBookContext?: boolean;
}

const AIChat = ({ includeBookContext = false }: AIChatProps) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [input, setInput] = useState('');
   const [loading, setLoading] = useState(false);

   const handleSend = async () => {
      if (!input.trim()) return;

      const userMessage: ChatMessage = {
         role: 'user',
         content: input,
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      setLoading(true);

      try {
         const response = await aiService.chat([...messages, userMessage], includeBookContext);

         const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: response,
         };

         setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
         console.error('Error sending message:', error);
         const errorMessage: ChatMessage = {
            role: 'assistant',
            content: "I'm sorry, there was an error processing your message. Please try again.",
         };
         setMessages((prev) => [...prev, errorMessage]);
      } finally {
         setLoading(false);
      }
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   return (
      <Paper
         elevation={2}
         sx={{
            height: '600px',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '16px',
            overflow: 'hidden',
         }}
      >
         <Box
            sx={{
               p: 2,
               bgcolor: 'primary.main',
               color: 'white',
               display: 'flex',
               alignItems: 'center',
               gap: 1,
            }}
         >
            <BotIcon />
            <Typography variant="h6">AI Library Assistant</Typography>
            {includeBookContext && (
               <Chip label="With book context" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
            )}
         </Box>

         <Box
            sx={{
               flex: 1,
               overflow: 'auto',
               p: 2,
               bgcolor: 'grey.50',
            }}
         >
            {messages.length === 0 ? (
               <Box
                  sx={{
                     height: '100%',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     flexDirection: 'column',
                     gap: 2,
                  }}
               >
                  <BotIcon sx={{ fontSize: 64, color: 'grey.400' }} />
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                     Hello! I'm your smart library assistant.
                     <br />
                     Ask me about books, recommendations or anything related to reading.
                  </Typography>
               </Box>
            ) : (
               <List>
                  {messages.map((message, index) => (
                     <ListItem
                        key={index}
                        sx={{
                           flexDirection: 'column',
                           alignItems: message.role === 'user' ? 'flex-end' : 'flex-start',
                           mb: 2,
                        }}
                     >
                        <Box
                           sx={{
                              display: 'flex',
                              gap: 1,
                              maxWidth: '80%',
                              flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                           }}
                        >
                           <Avatar
                              sx={{
                                 bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                                 width: 32,
                                 height: 32,
                              }}
                           >
                              {message.role === 'user' ? <PersonIcon /> : <BotIcon />}
                           </Avatar>
                           <Paper
                              elevation={1}
                              sx={{
                                 p: 2,
                                 bgcolor: message.role === 'user' ? 'primary.main' : 'white',
                                 color: message.role === 'user' ? 'white' : 'text.primary',
                                 borderRadius: '12px',
                              }}
                           >
                              <ListItemText
                                 primary={message.content}
                                 sx={{
                                    m: 0,
                                    whiteSpace: 'pre-wrap',
                                 }}
                              />
                           </Paper>
                        </Box>
                     </ListItem>
                  ))}
                  {loading && (
                     <ListItem sx={{ justifyContent: 'flex-start' }}>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                           <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                              <BotIcon />
                           </Avatar>
                           <CircularProgress size={24} />
                        </Box>
                     </ListItem>
                  )}
               </List>
            )}
         </Box>

         <Box
            sx={{
               p: 2,
               borderTop: 1,
               borderColor: 'divider',
               bgcolor: 'white',
            }}
         >
            <Box sx={{ display: 'flex', gap: 1 }}>
               <TextField
                  fullWidth
                  multiline
                  maxRows={3}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={loading}
                  variant="outlined"
                  size="small"
                  sx={{
                     '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                     },
                  }}
               />
               <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  sx={{
                     bgcolor: 'primary.main',
                     color: 'white',
                     '&:hover': {
                        bgcolor: 'primary.dark',
                     },
                     '&:disabled': {
                        bgcolor: 'grey.300',
                     },
                  }}
               >
                  <SendIcon />
               </IconButton>
            </Box>
         </Box>
      </Paper>
   );
};

export default AIChat;
