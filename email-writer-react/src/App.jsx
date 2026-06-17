import { useState, useEffect } from 'react';
import './App.css';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Link
} from '@mui/material';
import axios from 'axios';

// Premium Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Indigo
    },
    secondary: {
      main: '#ec4899', // Pink
    },
    background: {
      default: '#0f172a', // Slate 900
      paper: '#1e293b', // Slate 800
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", sans-serif',
    h3: {
      fontWeight: 800,
      background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
  },
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  const [language, setLanguage] = useState('');
  const [customContext, setCustomContext] = useState('');

  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch History on Mount
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/email/history`);
      setHistory(response.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE_URL}/api/email/generate`, {
        emailContent,
        tone,
        length,
        language,
        customContext
      });
      const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
      setGeneratedReply(data);
      // Refresh history list
      fetchHistory();
    } catch (err) {
      setError('Failed to generate email reply. Please verify your backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id, e) => {
    e.stopPropagation(); // Prevent loading into form
    try {
      await axios.delete(`${API_BASE_URL}/api/email/history/${id}`);
      fetchHistory();
    } catch (err) {
      console.error("Failed to delete history item", err);
    }
  };

  const handleLoadHistory = (item) => {
    setEmailContent(item.emailContent || '');
    setTone(item.tone || '');
    setLength(item.length || '');
    setLanguage(item.language || '');
    setCustomContext(item.customContext || '');
    setGeneratedReply(item.generatedReply || '');
    setDrawerOpen(false);
  };

  const handleClear = () => {
    setEmailContent('');
    setTone('');
    setLength('');
    setLanguage('');
    setCustomContext('');
    setGeneratedReply('');
    setError('');
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 6 }}>
        {/* Header Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Typography variant="h3" component="h1">
            Smart Email Reply Generator
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setDrawerOpen(true)}
            sx={{ borderRadius: '20px', textTransform: 'none', px: 3 }}
          >
            📜 History ({history.length})
          </Button>
        </Box>

        {/* Input Card Form */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4, border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <TextField
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            label="Original Email Content"
            placeholder="Paste the email you received here..."
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {/* Tone Selector */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Tone</InputLabel>
                <Select
                  value={tone || ''}
                  label="Tone"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="Professional">👔 Professional</MenuItem>
                  <MenuItem value="Casual">☕ Casual</MenuItem>
                  <MenuItem value="Friendly">😊 Friendly</MenuItem>
                  <MenuItem value="Urgent">🚨 Urgent</MenuItem>
                  <MenuItem value="Apologetic">🙏 Apologetic</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Length Selector */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Length</InputLabel>
                <Select
                  value={length || ''}
                  label="Length"
                  onChange={(e) => setLength(e.target.value)}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="Short">⚡ Short (1-2 sentences)</MenuItem>
                  <MenuItem value="Medium">📝 Medium (1-2 paragraphs)</MenuItem>
                  <MenuItem value="Long">📚 Long (Detailed response)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Language Selector */}
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={language || ''}
                  label="Language"
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="English">🇺🇸 English</MenuItem>
                  <MenuItem value="Spanish">🇪🇸 Spanish</MenuItem>
                  <MenuItem value="French">🇫🇷 French</MenuItem>
                  <MenuItem value="German">🇩🇪 German</MenuItem>
                  <MenuItem value="Hindi">🇮🇳 Hindi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          {/* Custom Context / Instructions */}
          <TextField
            fullWidth
            variant="outlined"
            label="Key Points / Special Instructions (Optional)"
            placeholder="e.g. Say I am busy until Friday, accept the offer, ask for price..."
            value={customContext || ''}
            onChange={(e) => setCustomContext(e.target.value)}
            sx={{ mb: 4 }}
          />

          {/* Action Buttons */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!emailContent || loading}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
                  },
                }}
              >
                {loading ? <CircularProgress size={26} color="inherit" /> : "⚡ Generate Smart Reply"}
              </Button>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleClear}
                fullWidth
                size="large"
                sx={{ py: 1.5, borderRadius: '10px' }}
              >
                🗑️ Clear Form
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Error Messaging */}
        {error && (
          <Paper sx={{ p: 2, bgcolor: 'error.dark', color: 'error.contrastText', borderRadius: 2, mb: 3 }}>
            <Typography variant="body1">⚠️ {error}</Typography>
          </Paper>
        )}

        {/* Generated Reply Card */}
        {generatedReply && (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, border: '1px solid rgba(99, 102, 241, 0.2)' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#818cf8' }}>
              ✨ Generated AI Reply:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              value={generatedReply || ''}
              inputProps={{ readOnly: true }}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#0f172a',
                }
              }}
            />

            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{ borderRadius: '10px', textTransform: 'none' }}
              onClick={() => navigator.clipboard.writeText(generatedReply)}
            >
              📋 Copy to Clipboard
            </Button>
          </Paper>
        )}

        {/* History Drawer */}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          PaperProps={{
            sx: { width: { xs: '100%', sm: 400 }, p: 3, bgcolor: '#0f172a' }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Saved Replies
            </Typography>
            <Button onClick={() => setDrawerOpen(false)}>✕ Close</Button>
          </Box>
          <Divider sx={{ mb: 2 }} />

          {history.length === 0 ? (
            <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 5 }}>
              No history found. Generate some email replies first!
            </Typography>
          ) : (
            <List>
              {history.map((item) => (
                <Paper
                  key={item.id}
                  elevation={1}
                  sx={{
                    mb: 2,
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: '#1e293b',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: '#334155',
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={() => handleLoadHistory(item)}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold' }}>
                      {item.tone || 'Default'} • {item.length || 'Medium'} • {item.language || 'English'}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      sx={{ minWidth: 0, p: 0.5 }}
                      onClick={(e) => handleDeleteHistory(item.id, e)}
                    >
                      🗑️
                    </Button>
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: 'text.secondary'
                    }}
                  >
                    {item.emailContent}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: 'italic',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: '#a5b4fc'
                    }}
                  >
                    {item.generatedReply}
                  </Typography>
                </Paper>
              ))}
            </List>
          )}
        </Drawer>

        {/* Premium Developer Footer */}
        <Box sx={{ mt: 8, py: 3, borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Developed with ❤️ by{' '}
            <Link href="https://github.com/umangshukla10" target="_blank" rel="noopener" color="primary" underline="hover">
              Umang Shukla
            </Link>{' '}
            |{' '}
            <Link href="mailto:shuklaumang012@gmail.com" color="primary" underline="hover">
              shuklaumang012@gmail.com
            </Link>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;