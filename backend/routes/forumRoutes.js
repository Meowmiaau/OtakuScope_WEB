// backend/routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const verifyToken = require('../middleware/authMiddleware');


router.post('/', verifyToken, forumController.createPost);
router.get('/', forumController.getPosts);
router.get('/tags', forumController.getTags);
router.get('/:id', forumController.getPostDetails);
router.delete('/:id', verifyToken, forumController.deletePost);
router.put('/:id', verifyToken, forumController.updatePost);
// Reactions
router.post('/:id/react', verifyToken, forumController.addReaction); // More RESTful path
router.delete('/:id/react', verifyToken, forumController.removeReaction);
// Comments
router.post('/:id/comments', verifyToken, forumController.addComment); // More RESTful
router.get('/:id/comments', forumController.getComments);

router.get('/user/:userId/posts', verifyToken, forumController.getUserPosts);
router.get('/:id/user-reaction', verifyToken, forumController.checkUserReaction);


module.exports = router;