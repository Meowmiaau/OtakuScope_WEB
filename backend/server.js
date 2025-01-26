const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const animeRoutes = require('./routes/animeRoutes');

require('dotenv').config();
const { checkConnection } = require('./config/db');
const verifyToken = require('./middleware/authMiddleware');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/anime',animeRoutes); // Anime routes
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



(async () => {
  await checkConnection();
})()