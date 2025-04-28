// backend/controllers/reviewController.js

const { getDBConnection, endConnection } = require('../config/db');

// Create or update a review
exports.createOrUpdateReview = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { anime_id, review_title, review_content } = req.body;
        const user_id = req.userId;

        // Check if review exists
        const [existing] = await conn.query(
            'SELECT * FROM anime_reviews WHERE user_id = ? AND anime_id = ?',
            [user_id, anime_id]
        );

        if (existing.length > 0) {
            await conn.query(
                `UPDATE anime_reviews
                 SET review_title = ?, review_content = ?, updated_at = NOW()
                 WHERE id = ?`,
                [review_title, review_content, existing[0].id]
            );
            return res.status(200).json({ message: 'Review updated successfully' });
        }

        await conn.query(
            `INSERT INTO anime_reviews
             (user_id, anime_id, review_title, review_content)
             VALUES (?, ?, ?, ?)`,
            [user_id, anime_id, review_title, review_content]
        );

        res.status(201).json({ message: 'Review created successfully' });
    } catch (error) {
        console.error('Error creating/updating review:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Don't end connection here to maintain it for other operations
    }
};

// Get reviews for an anime (paginated)
exports.getAnimeReviews = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { anime_id } = req.params;
        const { offset = 0, limit = 10 } = req.query;

        const [reviews] = await conn.query(`
            SELECT ar.*, u.username, u.profile_picture
            FROM anime_reviews ar
            JOIN users u ON ar.user_id = u.id
            WHERE ar.anime_id = ?
            ORDER BY ar.created_at DESC
            LIMIT ? OFFSET ?
        `, [anime_id, parseInt(limit), parseInt(offset)]);

        const [[{ count }]] = await conn.query(
            'SELECT COUNT(*) as count FROM anime_reviews WHERE anime_id = ?',
            [anime_id]
        );

        res.json({ reviews, total: count });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Don't end connection here
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { id } = req.params;
        const user_id = req.userId;

        const [review] = await conn.query(
            'SELECT * FROM anime_reviews WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (review.length === 0) {
            return res.status(404).json({ error: 'Review not found or unauthorized' });
        }

        await conn.query('DELETE FROM anime_reviews WHERE id = ?', [id]);
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        // Don't end connection here
    }
};

// Add this new endpoint to manually close connection when needed
exports.cleanupDB = async (req, res) => {
    try {
        await endConnection();
        res.status(200).json({ message: 'Connection closed successfully' });
    } catch (error) {
        console.error('Error closing connection:', error);
        res.status(500).json({ error: 'Failed to close connection' });
    }
};