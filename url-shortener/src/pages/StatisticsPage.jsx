import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { getStoredUrls, clearAllData } from '../utils/storage';
import { formatDate, getTimeUntilExpiry, isUrlExpired } from '../utils/helpers';
import { logger } from '../utils/logger';

const StatisticsPage = () => {
  const [urls, setUrls] = useState([]);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    loadUrls();
  }, []);

  const loadUrls = () => {
    const storedUrls = getStoredUrls();
    setUrls(storedUrls);
    logger.info('Loaded URLs for statistics', { count: storedUrls.length });
  };

  const handleAccordionChange = (shortcode) => (event, isExpanded) => {
    setExpanded({ ...expanded, [shortcode]: isExpanded });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    logger.info('Copied to clipboard', { text });
  };

  const getShortUrl = (shortcode) => {
    return `${window.location.origin}/${shortcode}`;
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      clearAllData();
      setUrls([]);
      logger.info('All data cleared by user');
    }
  };

  const getStatusColor = (url) => {
    if (isUrlExpired(url.expiryTime)) return 'error';
    const timeLeft = getTimeUntilExpiry(url.expiryTime);
    if (timeLeft.includes('m') && parseInt(timeLeft) < 60) return 'warning';
    return 'success';
  };

  if (urls.length === 0) {
    return (
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Statistics
        </Typography>
        
        <Alert severity="info" sx={{ mt: 2 }}>
          No shortened URLs found. Create some URLs on the home page to see statistics here.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          URL Statistics
        </Typography>
        
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={loadUrls}
          >
            Refresh
          </Button>
          
          <Button
            variant="outlined"
            color="error"
            onClick={handleClearAll}
          >
            Clear All Data
          </Button>
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Total URLs: {urls.length} | Total Clicks: {urls.reduce((sum, url) => sum + (url.clicks?.length || 0), 0)}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.shortcode}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body2" fontFamily="monospace">
                      {getShortUrl(url.shortcode)}
                    </Typography>
                    <Tooltip title="Copy URL">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(getShortUrl(url.shortcode))}
                      >
                        <CopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      maxWidth: 200, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {url.originalUrl}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={isUrlExpired(url.expiryTime) ? 'Expired' : 'Active'}
                    color={getStatusColor(url)}
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(url.expiryTime)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getTimeUntilExpiry(url.expiryTime)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {url.clicks?.length || 0}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(url.createdAt)}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Accordion
                    expanded={expanded[url.shortcode] || false}
                    onChange={handleAccordionChange(url.shortcode)}
                    sx={{ boxShadow: 'none' }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ minHeight: 'auto', p: 0 }}
                    >
                      <Typography variant="body2" color="primary">
                        View Details
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0, mt: 1 }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Click Details:
                        </Typography>
                        
                        {url.clicks && url.clicks.length > 0 ? (
                          <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                            {url.clicks.map((click, index) => (
                              <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                <Typography variant="body2">
                                  <strong>Time:</strong> {formatDate(click.timestamp)}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Source:</strong> {click.referer}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Location:</strong> {click.geo}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No clicks recorded yet.
                          </Typography>
                        )}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StatisticsPage; 