// backend/routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const verifyToken = require('../middleware/authMiddleware');

// Create post (requires auth)
router.post('/', verifyToken, forumController.createPost);

// Get posts (public)
router.get('/', forumController.getPosts);

// Get post details (public)
router.get('/:id', forumController.getPostDetails);

// Add reaction (requires auth)
router.post('/reaction', verifyToken, forumController.addReaction);

// Add comment (requires auth)
router.post('/comment', verifyToken, forumController.addComment);

// Delete post (requires auth)
router.delete('/:id', verifyToken, forumController.deletePost);

// Forum
router.get('/tags', forumController.getTags);
router.get('/', forumController.getPosts);
router.post('/', verifyToken, forumController.createPost);
router.get('/:id', forumController.getPostDetails);

module.exports = router;