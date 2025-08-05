import { logger } from './logger.js';

// URL validation
export const isValidUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch (error) {
    logger.error('URL validation failed', { url, error: error.message });
    return false;
  }
};

// Generate random shortcode
export const generateShortcode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Check if shortcode is unique
export const isShortcodeUnique = (shortcode, existingUrls) => {
  return !existingUrls.some(url => url.shortcode === shortcode);
};

// Validate custom shortcode
export const isValidShortcode = (shortcode) => {
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  return alphanumericRegex.test(shortcode) && shortcode.length >= 3 && shortcode.length <= 10;
};

// Validate validity period
export const isValidValidityPeriod = (minutes) => {
  const num = parseInt(minutes);
  return !isNaN(num) && num > 0 && num <= 525600; // Max 1 year in minutes
};

// Generate fake geo location
export const generateFakeGeoLocation = () => {
  const locations = ['India', 'USA', 'UK', 'Canada', 'Australia', 'Germany', 'France', 'Japan'];
  return locations[Math.floor(Math.random() * locations.length)];
};

// Get source info
export const getSourceInfo = () => {
  return {
    referer: document.referrer || 'Direct',
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    geo: generateFakeGeoLocation()
  };
};

// Check if URL is expired
export const isUrlExpired = (expiryTime) => {
  return new Date() > new Date(expiryTime);
};

// Format date for display
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

// Get time until expiry
export const getTimeUntilExpiry = (expiryTime) => {
  const now = new Date();
  const expiry = new Date(expiryTime);
  const diff = expiry - now;
  
  if (diff <= 0) return 'Expired';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}; 