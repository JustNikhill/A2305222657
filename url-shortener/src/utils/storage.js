import { logger } from './logger.js';

const STORAGE_KEY = 'urlShortenerData';

// Get all URLs from localStorage
export const getStoredUrls = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    logger.error('Failed to get stored URLs', { error: error.message });
    return [];
  }
};

// Save URLs to localStorage
export const saveUrls = (urls) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    logger.success('URLs saved to localStorage', { count: urls.length });
  } catch (error) {
    logger.error('Failed to save URLs to localStorage', { error: error.message });
  }
};

// Add a new URL
export const addUrl = (urlData) => {
  try {
    const urls = getStoredUrls();
    urls.push(urlData);
    saveUrls(urls);
    logger.success('New URL added', { shortcode: urlData.shortcode });
    return true;
  } catch (error) {
    logger.error('Failed to add URL', { error: error.message });
    return false;
  }
};

// Update URL clicks
export const updateUrlClicks = (shortcode, clickData) => {
  try {
    const urls = getStoredUrls();
    const urlIndex = urls.findIndex(url => url.shortcode === shortcode);
    
    if (urlIndex !== -1) {
      if (!urls[urlIndex].clicks) {
        urls[urlIndex].clicks = [];
      }
      urls[urlIndex].clicks.push(clickData);
      saveUrls(urls);
      logger.success('URL clicks updated', { shortcode, clickCount: urls[urlIndex].clicks.length });
      return true;
    }
    
    logger.warn('URL not found for click update', { shortcode });
    return false;
  } catch (error) {
    logger.error('Failed to update URL clicks', { error: error.message });
    return false;
  }
};

// Get URL by shortcode
export const getUrlByShortcode = (shortcode) => {
  try {
    const urls = getStoredUrls();
    return urls.find(url => url.shortcode === shortcode);
  } catch (error) {
    logger.error('Failed to get URL by shortcode', { shortcode, error: error.message });
    return null;
  }
};

// Clear all stored data
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    logger.success('All stored data cleared');
  } catch (error) {
    logger.error('Failed to clear stored data', { error: error.message });
  }
}; 