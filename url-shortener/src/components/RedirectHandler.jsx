import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { getUrlByShortcode, updateUrlClicks } from '../utils/storage';
import { getSourceInfo, isUrlExpired } from '../utils/helpers';
import { logger } from '../utils/logger';

const RedirectHandler = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        logger.info('Processing redirect request', { shortcode });
        
        // Get URL data from storage
        const urlData = getUrlByShortcode(shortcode);
        
        if (!urlData) {
          logger.warn('Shortcode not found', { shortcode });
          setError('URL not found');
          setStatus('error');
          return;
        }

        // Check if URL is expired
        if (isUrlExpired(urlData.expiryTime)) {
          logger.warn('URL expired', { shortcode, expiryTime: urlData.expiryTime });
          setError('This URL has expired');
          setStatus('error');
          return;
        }

        // Track the click
        const clickData = getSourceInfo();
        updateUrlClicks(shortcode, clickData);
        
        logger.success('Redirecting to original URL', { 
          shortcode, 
          originalUrl: urlData.originalUrl 
        });

        // Redirect to original URL
        window.location.href = urlData.originalUrl;
        
      } catch (error) {
        logger.error('Redirect failed', { shortcode, error: error.message });
        setError('Failed to redirect');
        setStatus('error');
      }
    };

    handleRedirect();
  }, [shortcode, navigate]);

  if (status === 'loading') {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="50vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Redirecting...
        </Typography>
      </Box>
    );
  }

  if (status === 'error') {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        minHeight="50vh"
      >
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Typography variant="body1" color="text.secondary">
          The requested URL could not be found or has expired.
        </Typography>
      </Box>
    );
  }

  return null;
};

export default RedirectHandler; 