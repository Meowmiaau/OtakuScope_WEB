// frontend/src/components/ReviewItem.js
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Avatar } from '@mui/material';
import { format } from 'date-fns';
import './../styles/ReviewItem.css';

const ReviewItem = ({ review, index }) => {
  return (
    <Box className="review-item-container">
      <Box className="review-header">
        <Avatar
          src={review.profile_picture || '/AnimeGirl.png'}
          alt={review.username}
          className="review-avatar"
        />
        <Box>
          <Typography className="review-title">
          {review.username}&apos;s  Review: {review.review_title}
          </Typography>
          <Typography className="review-meta">
            Posted on {format(new Date(review.created_at), 'MMM d, yyyy • h:mm a')}
            {review.updated_at && review.updated_at !== review.created_at && (
              ` • Edited on ${format(new Date(review.updated_at), 'MMM d, yyyy • h:mm a')}`
            )}
          </Typography>
        </Box>
      </Box>
      <Box className="review-content">
        {review.review_content}
      </Box>
    </Box>
  );
};

ReviewItem.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    profile_picture: PropTypes.string,
    review_title: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]).isRequired,
    updated_at: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    review_content: PropTypes.string.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired
};

ReviewItem.defaultProps = {
  review: {
    profile_picture: '/default-avatar.png',
    updated_at: null
  }
};

export default ReviewItem;