const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');  // Ensure the token verification middleware is used
const { getAnimeDetails, saveOrUpdateAnimeInteraction } = require('../controllers/animeController');  // Import controller functions

// Route to fetch anime details (GET /api/anime/:id)
router.get('/:id', verifyToken, getAnimeDetails);

// Route to add or update anime interaction (POST /api/anime/:id)
router.post('/:id', verifyToken, saveOrUpdateAnimeInteraction);



module.exports = router;
