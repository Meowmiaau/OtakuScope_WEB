const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const animeRoutes = require('./routes/animeRoutes');
const listRoutes = require('./routes/listRoutes');
const { checkConnection } = require('./config/db');
const verifyToken = require('./middleware/authMiddleware');
const reviewRoutes = require('./routes/reviewRoutes');
const forumRoutes = require('./routes/forumRoutes');

const app = express();

// Middleware
app.use(cors(
    {origin: "http://localhost:3000", // frontend origin
    credentials: true}
));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', verifyToken, animeRoutes); // Protect anime routes with the verifyToken middleware
app.use('/api/lists', verifyToken, listRoutes); // Protect list routes with the verifyToken middleware
app.use('/api/reviews', reviewRoutes);
// For forums:
app.use('/api/forum', forumRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
(async () => {
    try {
        await checkConnection();
        console.log('Database connected successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1); // Exit if DB connection fails
    }
})();
