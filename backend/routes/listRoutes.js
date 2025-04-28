const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const listController = require('../controllers/listController');

// Create new list
router.post('/', verifyToken, listController.createList);

// Get all user lists
router.get('/', verifyToken, listController.getLists);

// Get all anime IDs in a list
router.get('/:listId/anime', verifyToken, listController.getAnimeInList);

// Add anime to a list
router.post('/:listId/anime', verifyToken, listController.addAnimeToList);

// Delete anime from a list
router.delete('/:listId/anime/:animeId', verifyToken, listController.deleteAnimeFromList);

// Public route to fetch all lists
router.get('/all',verifyToken, listController.getAllLists);
module.exports = router;
