import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Divider
} from '@mui/material';
import { Add as AddIcon, ContentCopy as CopyIcon } from '@mui/icons-material';
import UrlForm from '../components/UrlForm';
import { 
  isValidUrl, 
  generateShortcode, 
  isShortcodeUnique, 
  formatDate,
  getTimeUntilExpiry 
} from '../utils/helpers';
import { addUrl, getStoredUrls } from '../utils/storage';
import { logger } from '../utils/logger';

const HomePage = () => {
  const [urlForms, setUrlForms] = useState([{ originalUrl: '', validityPeriod: 30, customShortcode: '' }]);
  const [results, setResults] = useState([]);
  const [errors, setErrors] = useState({});
  const [existingUrls, setExistingUrls] = useState([]);

  useEffect(() => {
    // Load existing URLs for shortcode uniqueness validation
    const urls = getStoredUrls();
    setExistingUrls(urls);
  }, []);

  const addUrlForm = () => {
    if (urlForms.length < 5) {
      setUrlForms([...urlForms, { originalUrl: '', validityPeriod: 30, customShortcode: '' }]);
      logger.info('Added new URL form', { formCount: urlForms.length + 1 });
    }
  };

  const removeUrlForm = (index) => {
    const newForms = urlForms.filter((_, i) => i !== index);
    setUrlForms(newForms);
    logger.info('Removed URL form', { formCount: newForms.length });
  };

  const updateUrlForm = (index, data) => {
    const newForms = [...urlForms];
    newForms[index] = data;
    setUrlForms(newForms);
  };

  const validateForms = () => {
    const newErrors = {};
    
    urlForms.forEach((form, index) => {
      if (!form.originalUrl) {
        newErrors[`${index}.originalUrl`] = 'URL is required';
      } else if (!isValidUrl(form.originalUrl)) {
        newErrors[`${index}.originalUrl`] = 'Please enter a valid URL';
      }
      
      if (form.customShortcode && !isShortcodeUnique(form.customShortcode, existingUrls)) {
        newErrors[`${index}.customShortcode`] = 'This shortcode is already in use';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForms()) {
      logger.warn('Form validation failed', { errors });
      return;
    }

    const newResults = [];
    
    for (const form of urlForms) {
      if (!form.originalUrl) continue;
      
      try {
        // Generate shortcode if not provided
        let shortcode = form.customShortcode;
        if (!shortcode) {
          do {
            shortcode = generateShortcode();
          } while (!isShortcodeUnique(shortcode, existingUrls));
        }
        
        // Calculate expiry time
        const expiryTime = new Date(Date.now() + form.validityPeriod * 60 * 1000);
        
        // Create URL data
        const urlData = {
          originalUrl: form.originalUrl,
          shortcode,
          validityPeriod: form.validityPeriod,
          expiryTime: expiryTime.toISOString(),
          createdAt: new Date().toISOString(),
          clicks: []
        };
        
        // Save to localStorage
        if (addUrl(urlData)) {
          newResults.push(urlData);
          logger.success('URL shortened successfully', { shortcode, originalUrl: form.originalUrl });
        }
        
      } catch (error) {
        logger.error('Failed to shorten URL', { error: error.message, form });
      }
    }
    
    if (newResults.length > 0) {
      setResults(newResults);
      setExistingUrls([...existingUrls, ...newResults]);
      // Reset forms
      setUrlForms([{ originalUrl: '', validityPeriod: 30, customShortcode: '' }]);
      logger.success('URL shortening completed', { count: newResults.length });
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    logger.info('Copied to clipboard', { text });
  };

  const getShortUrl = (shortcode) => {
    return `${window.location.origin}/${shortcode}`;
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Shorten up to 5 URLs at once. Each URL can have a custom validity period and optional custom shortcode.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <form onSubmit={handleSubmit}>
          {urlForms.map((form, index) => (
            <UrlForm
              key={index}
              index={index}
              data={form}
              onChange={updateUrlForm}
              onRemove={removeUrlForm}
              existingUrls={existingUrls}
              errors={errors}
            />
          ))}
          
          <Box display="flex" gap={2} mt={2}>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addUrlForm}
              disabled={urlForms.length >= 5}
            >
              Add Another URL
            </Button>
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={urlForms.length === 0}
            >
              Shorten URLs
            </Button>
          </Box>
        </form>
      </Paper>

      {results.length > 0 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Shortened URLs
          </Typography>
          
          <List>
            {results.map((result, index) => (
              <Box key={result.shortcode}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" component="span">
                          {getShortUrl(result.shortcode)}
                        </Typography>
                        <Chip 
                          label={getTimeUntilExpiry(result.expiryTime)} 
                          color={getTimeUntilExpiry(result.expiryTime) === 'Expired' ? 'error' : 'success'}
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Original: {result.originalUrl}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Expires: {formatDate(result.expiryTime)}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={() => copyToClipboard(getShortUrl(result.shortcode))}
                      title="Copy URL"
                    >
                      <CopyIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < results.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default HomePage; 