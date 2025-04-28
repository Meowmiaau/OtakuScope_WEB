// frontend/src/components/ReviewPagination.js

// FOR VIEWING OTHERS REVIEWS
import React from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@mui/material';
import './../styles/ReviewPagination.css';

const ReviewPagination = ({ offset, total, onOffsetChange }) => {
  return (
    <Box className="review-pagination-container">
      <Button
        className="pagination-button"
        variant="outlined"
        onClick={() => onOffsetChange(Math.max(0, offset - 10))}
        disabled={offset === 0}
      >
        Show Less
      </Button>
      <Button
        className="pagination-button"
        variant="outlined"
        onClick={() => onOffsetChange(offset + 10)}
        disabled={offset + 10 >= total}
      >
        Show 10 More
      </Button>
    </Box>
  );
};

ReviewPagination.propTypes = {
  offset: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onOffsetChange: PropTypes.func.isRequired
};

export default ReviewPagination;