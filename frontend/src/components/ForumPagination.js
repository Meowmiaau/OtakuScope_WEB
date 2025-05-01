// frontend/src/components/ForumPagination.js
import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Typography
} from '@mui/material';
import styles from './../styles/ForumPagination.css';

const ForumPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <Box className={styles.paginationContainer}>
      <Button
        variant="outlined"
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        Previous
      </Button>

      <Typography variant="body1" className={styles.pageText}>
        Page {currentPage} of {totalPages}
      </Typography>

      <Button
        variant="outlined"
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Next
      </Button>
    </Box>
  );
};

ForumPagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default ForumPagination;