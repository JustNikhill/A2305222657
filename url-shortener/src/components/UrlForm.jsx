import { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { isValidUrl, isValidValidityPeriod, isValidShortcode } from '../utils/helpers';

const UrlForm = ({ 
  index, 
  data, 
  onChange, 
  onRemove, 
  existingUrls = [],
  errors = {} 
}) => {
  const [localErrors, setLocalErrors] = useState({});

  const validateField = (field, value) => {
    const newErrors = { ...localErrors };
    
    switch (field) {
      case 'originalUrl':
        if (!value) {
          newErrors.originalUrl = 'URL is required';
        } else if (!isValidUrl(value)) {
          newErrors.originalUrl = 'Please enter a valid URL (https://...)';
        } else {
          delete newErrors.originalUrl;
        }
        break;
        
      case 'validityPeriod':
        if (value && !isValidValidityPeriod(value)) {
          newErrors.validityPeriod = 'Please enter a valid number of minutes (1-525600)';
        } else {
          delete newErrors.validityPeriod;
        }
        break;
        
      case 'customShortcode':
        if (value && !isValidShortcode(value)) {
          newErrors.customShortcode = 'Shortcode must be 3-10 alphanumeric characters';
        } else if (value && existingUrls.some(url => url.shortcode === value)) {
          newErrors.customShortcode = 'This shortcode is already in use';
        } else {
          delete newErrors.customShortcode;
        }
        break;
        
      default:
        break;
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    const newData = { ...data, [field]: value };
    onChange(index, newData);
    
    // Validate the field
    validateField(field, value);
  };

  const allErrors = { ...localErrors, ...errors };

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: 2,
        p: 3,
        mb: 2,
        backgroundColor: '#fafafa'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h3>URL #{index + 1}</h3>
        <Tooltip title="Remove URL">
          <IconButton 
            onClick={() => onRemove(index)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
      
      <TextField
        fullWidth
        label="Long URL"
        placeholder="https://example.com/very-long-url"
        value={data.originalUrl || ''}
        onChange={(e) => handleChange('originalUrl', e.target.value)}
        error={!!allErrors.originalUrl}
        helperText={allErrors.originalUrl}
        required
        sx={{ mb: 2 }}
      />
      
      <Box display="flex" gap={2}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Validity Period (minutes)</InputLabel>
          <Select
            value={data.validityPeriod || 30}
            label="Validity Period (minutes)"
            onChange={(e) => handleChange('validityPeriod', e.target.value)}
            error={!!allErrors.validityPeriod}
          >
            <MenuItem value={15}>15 minutes</MenuItem>
            <MenuItem value={30}>30 minutes</MenuItem>
            <MenuItem value={60}>1 hour</MenuItem>
            <MenuItem value={1440}>1 day</MenuItem>
            <MenuItem value={10080}>1 week</MenuItem>
            <MenuItem value={43200}>1 month</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          label="Custom Shortcode (optional)"
          placeholder="mycode123"
          value={data.customShortcode || ''}
          onChange={(e) => handleChange('customShortcode', e.target.value)}
          error={!!allErrors.customShortcode}
          helperText={allErrors.customShortcode || 'Leave empty for auto-generation'}
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </Box>
  );
};

export default UrlForm; 