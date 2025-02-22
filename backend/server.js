const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const animeRoutes = require('./routes/animeRoutes');
require('dotenv').config();
const { checkConnection } = require('./config/db');
const verifyToken = require('./middleware/authMiddleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', verifyToken, animeRoutes); // Protect anime routes with the verifyToken middleware

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Check DB connection on startup
(async () => {
    try {
        await checkConnection();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1); // Exit if DB connection fails
    }
})();
