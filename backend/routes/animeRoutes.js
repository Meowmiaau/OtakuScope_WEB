const express = require('express');
const { db } = require('../config/db');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

// Fetch anime details (GET /api/anime/:id)
router.get('/:id', verifyToken, async (req, res) => {
    const animeId = req.params.id;
    const userId = req.userId;

    try {
        const connection = await db();

        // Fetch anime details for the user and anime
        const [animeDetails] = await connection.execute(
            `SELECT * FROM anime_details WHERE user_id = ? AND anime_id = ?`,
            [userId, animeId]
        );

        const response = {
            status: animeDetails[0]?.status || 'Plan to Watch',
            is_favorite: animeDetails[0]?.is_favorite || false,
            score: animeDetails[0]?.score || null,
        };
        console.log('response:', response);

        res.json(response);
    } catch (error) {
        console.error('Error fetching anime details:', error.message);
        res.status(500).json({ error: 'Failed to fetch anime details' });
    }
});


// Add or update anime interaction (POST /api/anime/:id)
router.post('/:id', verifyToken, async (req, res) => {
    const animeId = req.params.id;
    const { status, is_favorite = false, score = null } = req.body;
    const userId = req.userId;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    try {
        const connection = await db();

        // Check existing data
        const [existing] = await connection.execute(
            `SELECT * FROM anime_details WHERE user_id = ? AND anime_id = ?`,
            [userId, animeId]
        );

        if (
            existing.length > 0 &&
            existing[0].status === status &&
            existing[0].is_favorite === is_favorite &&
            existing[0].score === score
        ) {
            return res.json({ message: 'No changes needed' });
        }

        // Insert or update the interaction
        const query = `
            INSERT INTO anime_details (user_id, anime_id, status, is_favorite, score)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            status = VALUES(status), 
            is_favorite = VALUES(is_favorite), 
            score = VALUES(score)
        `;
        await connection.execute(query, [userId, animeId, status, is_favorite, score]);

        res.json({ message: 'Anime interaction updated successfully' });
    } catch (error) {
        console.error('Error saving anime interaction:', error.message);
        res.status(500).json({ error: 'Failed to save anime interaction' });
    }
});

module.exports = router;
