const {getDBConnection} = require("../config/db"); 

const getAnimeDetails = async (req, res) => {
    const animeId = req.params.id;
    const userId = req.userId;

    try {
        const connection = await getDBConnection();
        // Fetch anime details for the user and anime
        const [animeDetails] = await connection.execute(
            `SELECT * FROM anime_details WHERE user_id = ? AND anime_id = ?`,
            [userId, animeId]
        );
        console.log('animeDetails:', animeDetails);``

        const response = {
            status: animeDetails[0]?.status || 'Not Set',
            is_favorite: animeDetails[0]?.is_favorite ? true : false,
            score: animeDetails[0]?.score || null,
        };
        console.log('response:', response);

        res.json(response);
    } catch (error) {
        console.error('Error fetching anime details:', error.message);
        res.status(500).json({ error: 'Failed to fetch anime details' });
    }
};

// Save or update anime interaction
const saveOrUpdateAnimeInteraction = async (req, res) => {
    try {
        const userId = req.userId;
        const animeId = req.params.id;
        const { status, is_favorite, score } = req.body;
        console.log(`Anime interaction: user=${userId}, anime=${animeId}, status=${status}, is_favorite=${is_favorite}, score=${score}`);
        
        // Get the connection properly
        const connection = await getDBConnection();
        
        // Use the connection object, not db
        await connection.execute(
            `INSERT INTO anime_details (user_id, anime_id, status, is_favorite, score) 
             VALUES (?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE status = VALUES(status), is_favorite = VALUES(is_favorite), score = VALUES(score)`,
            [userId, animeId, status, is_favorite, score]
        );

        res.json({ message: "Anime interaction updated successfully" });
    } catch (error) {
        console.error("Error updating anime interaction:", error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

module.exports = { getAnimeDetails, saveOrUpdateAnimeInteraction };
