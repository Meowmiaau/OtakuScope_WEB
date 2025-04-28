// frontend/src/components/ReviewSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Divider,
    CircularProgress,
    Avatar,
    TextareaAutosize
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './../styles/ReviewSection.css';
import ReviewItem from './ReviewItem';
import ReviewPagination from './ReviewPagination';

const backendPath = "http://localhost:5000";

const ReviewSection = ({ animeId }) => {
    const [userReview, setUserReview] = useState(null);
    const [otherReviews, setOtherReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewContent, setReviewContent] = useState('');
    const userId = jwtDecode(localStorage.getItem('token'))?.id;

    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            if (userId) {
                const userRes = await axios.get(`${backendPath}/api/reviews/anime/${animeId}`, {
                    params: { limit: 1, offset: 0 },
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                const userReview = userRes.data.reviews.find(r => r.user_id === userId);
                setUserReview(userReview);
                if (userReview) {
                    setReviewTitle(userReview.review_title);
                    setReviewContent(userReview.review_content);
                }
            }

            const res = await axios.get(`${backendPath}/api/reviews/anime/${animeId}`, {
                params: { limit: 10, offset }
            });
            setOtherReviews(res.data.reviews.filter(r => r.user_id !== userId));
            setTotalReviews(res.data.total);
        } catch (error) {
            setError('Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, [animeId, offset]);

    const handleSubmitReview = async () => {
        try {
            if (!reviewTitle.trim() || !reviewContent.trim()) return;

            setSubmitting(true);
            setError(null);

            await axios.post(
                `${backendPath}/api/reviews`,
                { anime_id: animeId, review_title: reviewTitle, review_content: reviewContent },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            setReviewTitle('');
            setReviewContent('');
            setIsEditing(false);
            await fetchReviews();
            setSuccess('Review submitted successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            setError(error.response?.data?.error || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async () => {
        try {
            await axios.delete(`${backendPath}/api/reviews/${userReview.id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUserReview(null);
            setReviewTitle('');
            setReviewContent('');
            fetchReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    return (
        <Box className="review-section">
            <Typography className='reviews' variant="h5" gutterBottom>Reviews</Typography>

            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            <Box className="review-user-section">
                {userReview ? (!isEditing ? (
                    <Box className="review-user-details">
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar src={userReview.profile_picture || '/AnimeGirl.png'} sx={{
                                    width: 60,
                                    height: 60,
                                    mr: 2,
                                    border: '3px solid rgb(0, 167, 245)'
                                }} />
                                <Typography variant="h6" sx={{ fontWeight: 'medium', color: 'rgb(19, 121, 169)' }}>
                                    Your Review: {userReview.review_title}
                                </Typography>
                            </Box>
                            <Box className="review-actions">
                            <IconButton
                                onClick={() => setIsEditing(true)}
                                sx={{
                                    color: 'rgb(0, 167, 245)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0, 167, 245, 0.08)'
                                    }
                                }}
                            >
                                <EditIcon />
                                <Typography variant="caption" sx={{ ml: 0.5 }}>Edit</Typography>
                            </IconButton>
                            <IconButton
                                onClick={handleDeleteReview}
                                sx={{
                                    color: 'error.main',
                                    '&:hover': {
                                        backgroundColor: 'rgba(244, 67, 54, 0.08)'
                                    }
                                }}
                            >
                                <DeleteIcon />
                                <Typography variant="caption" sx={{ ml: 0.5 }}>Delete</Typography>
                            </IconButton>
                        </Box>
                        </Box>
                        <Box className="review-content">
                            {userReview.review_content}
                        </Box>
                    </Box>
                ) : (
                    <Box className="review-edit-form">
                        <TextField
                            fullWidth
                            label="Review Title"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            sx={{ mb: 2 }}
                            className="review-title-input"
                        />
                        <TextareaAutosize
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            minRows={6}
                            style={{ width: '98%', padding: '10px', marginBottom: '16px' }}
                        />
                        <Button variant="contained" onClick={handleSubmitReview} sx={{ mt: 2 }}>
                            Update Review
                        </Button>
                        <Button onClick={() => setIsEditing(false)} sx={{ mt: 2, ml: 2 }}>
                            Cancel
                        </Button>
                    </Box>
                )) : (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Write a Review</Typography>
                        <TextField
                            fullWidth
                            label="Review Title"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            sx={{ mb: 2}}
                            className="review-title-input"
                        />
                        <TextareaAutosize
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="Share your detailed thoughts about this anime..."
                            minRows={6}
                            style={{ width: '98%', padding: '10px', marginBottom: '16px', color: '#222' }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSubmitReview}
                            disabled={!reviewTitle.trim() || !reviewContent.trim() || submitting}
                            sx={{ mt: 2 }}
                        >
                            {submitting ? <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} /> : 'Post My Review'}
                        </Button>
                    </Box>
                )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box className="review-other-section">
                <Typography className='explore-reviews' variant="h6" gutterBottom>
                    Explore Others&apos; Reviews ({totalReviews - 1})
                </Typography>

                {loading ? <CircularProgress /> : otherReviews.length > 0 ? (
                    <Box>
                    {otherReviews.map((review, index) => (
                      <ReviewItem key={review.id} review={review} index={offset + index + 1} />
                    ))}
                    <ReviewPagination
                      offset={offset}
                      total={totalReviews}
                      onOffsetChange={(newOffset) => setOffset(newOffset)}
                    />
                  </Box>

                ) : <Typography>No reviews yet. Be the first to review!</Typography>}
            </Box>
            {success && <Typography color="success.main" sx={{ mb: 2 }}>{success}</Typography>}
        </Box>
    );
};

export default ReviewSection;

ReviewSection.propTypes = {
    animeId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};