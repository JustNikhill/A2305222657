import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import StatisticsPage from '../pages/StatisticsPage';
import RedirectHandler from '../components/RedirectHandler';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const Navigation = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        URL Shortener
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/"
        >
          Home
        </Button>
        <Button 
          color="inherit" 
          component={RouterLink} 
          to="/statistics"
        >
          Statistics
        </Button>
      </Box>
    </Toolbar>
  </AppBar>
);

const AppRouter = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/:shortcode" element={<RedirectHandler />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
};

export default AppRouter; 