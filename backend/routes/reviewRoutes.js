// backend/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware');

// Create or update a review
router.post('/', verifyToken, reviewController.createOrUpdateReview);

// Get reviews for an anime
router.get('/anime/:anime_id', reviewController.getAnimeReviews);

// Delete a review
router.delete('/:id', verifyToken, reviewController.deleteReview);

module.exports = router;