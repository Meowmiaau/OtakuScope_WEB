// frontend/src/components/ForumTagFilter.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Autocomplete,
  TextField,
  Chip,
  Typography,
  Popper,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import './../styles/ForumTagFilter.css';

const ForumTagFilter = ({ onTagSelect }) => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/forum/tags`, {
          withCredentials: true
        });
        setTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
        setError(error.response?.data?.error || 'Failed to load tags');
        setTags([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (event, newValue) => {
    setSelectedTag(newValue);
    onTagSelect(newValue?.name || '');
  };

  const handleClearFilter = () => {
    setSelectedTag(null);
    onTagSelect('');
  };

  return (
    <Box className="tag-filter-container">
      <Autocomplete
        disablePortal
        id="tag-filter"
        options={tags}
        getOptionLabel={(option) => option?.name || ''}
        value={selectedTag}
        onChange={handleTagChange}
        className="tag-autocomplete"
        loading={loading}
        loadingText="Loading .."
        noOptionsText={error ? 'Error loading tags' : 'No tags available'}
        PopperComponent={(props) => (
          <Popper {...props} className="tag-popper" placement="bottom-start" />
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Filter by tag"
            variant="outlined"
            size="small"
            className="tag-input"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            error={!!error}
            helperText={error}
          />
        )}
        renderOption={(props, option) => (
          <Box key={option.name} component="li" {...props} className="tag-option">
            <Chip label={option.name} size="small" className="tag-option-chip" />
            <Typography variant="caption" className="tag-option-count">
              ({option.postCount} posts)
            </Typography>
          </Box>
        )}
      />

      {selectedTag && (
        <Button
          onClick={handleClearFilter}
          className="clear-filter-button"
          size="small"
          variant="text"
        >
          Clear
        </Button>
      )}
    </Box>
  );
};

ForumTagFilter.propTypes = {
  onTagSelect: PropTypes.func.isRequired
};

export default ForumTagFilter;
