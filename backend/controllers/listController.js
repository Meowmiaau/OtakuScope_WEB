const { getDBConnection } = require('../config/db');

// Create a new list
exports.createList = async (req, res) => {
  const userId = req.userId;
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'List name is required' });

  try {
    const db = await getDBConnection();
    await db.query(`INSERT INTO lists (user_id, name) VALUES (?, ?)`, [userId, name]);
    res.status(201).json({ message: 'List created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all lists with anime for a user
// controllers/lists.js
exports.getLists = async (req, res) => {
    const userId = req.userId;
    try {
      const db = await getDBConnection();
  
      // 1) fetch lists + count
      const [lists] = await db.query(
        `SELECT l.id, l.name, COUNT(al.anime_id) AS animeCount
         FROM lists l
         LEFT JOIN anime_lists al ON l.id = al.list_id
         WHERE l.user_id = ?
         GROUP BY l.id
         ORDER BY l.created_at DESC`,
        [userId]
      );
  
      // 2) fetch all anime-to-list mappings for this user’s lists
      const [animeLists] = await db.query(
        `SELECT list_id, anime_id FROM anime_lists
         WHERE list_id IN (SELECT id FROM lists WHERE user_id = ?)`,
        [userId]
      );
  
      // 3) build a map of list_id → [animeId,…]
      const listAnimeMap = {};
      animeLists.forEach(row => {
        listAnimeMap[row.list_id] = listAnimeMap[row.list_id] || [];
        listAnimeMap[row.list_id].push(row.anime_id);
      });
  
      // 4) combine them
      const fullLists = lists.map(list => ({
        id: list.id,
        name: list.name,
        animeCount: list.animeCount,
        animeIds: listAnimeMap[list.id] || []
      }));
  
      res.status(200).json(fullLists);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

// Get anime IDs inside a specific list
exports.getAnimeInList = async (req, res) => {
  const userId = req.userId;
  const { listId } = req.params;

  try {
    const db = await getDBConnection();

    // Verify list belongs to user
    const [listCheck] = await db.query(`SELECT * FROM lists WHERE id = ? AND user_id = ?`, [listId, userId]);
    if (listCheck.length === 0) return res.status(403).json({ message: 'Unauthorized' });

    const [animeList] = await db.query(
      `SELECT anime_id FROM anime_lists WHERE list_id = ?`,
      [listId]
    );

    res.status(200).json(animeList.map(row => row.anime_id));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add an anime to a list
exports.addAnimeToList = async (req, res) => {
  const userId = req.userId;
  const { listId } = req.params;
  const { animeId } = req.body;

  if (!animeId) return res.status(400).json({ message: 'Anime ID is required' });

  try {
    const db = await getDBConnection();

    // Verify list belongs to user
    const [listCheck] = await db.query(`SELECT * FROM lists WHERE id = ? AND user_id = ?`, [listId, userId]);
    if (listCheck.length === 0) return res.status(403).json({ message: 'Unauthorized' });

    // Try insert (duplicate will automatically fail because of UNIQUE constraint)
    await db.query(
      `INSERT IGNORE INTO anime_lists (list_id, anime_id) VALUES (?, ?)`,
      [listId, animeId]
    );

    res.status(201).json({ message: 'Anime added to list' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete an anime from a list
exports.deleteAnimeFromList = async (req, res) => {
  const userId = req.userId;
  const { listId, animeId } = req.params;

  try {
    const db = await getDBConnection();

    // Verify list belongs to user
    const [listCheck] = await db.query(`SELECT * FROM lists WHERE id = ? AND user_id = ?`, [listId, userId]);
    if (listCheck.length === 0) return res.status(403).json({ message: 'Unauthorized' });

    await db.query(
      `DELETE FROM anime_lists WHERE list_id = ? AND anime_id = ?`,
      [listId, animeId]
    );

    res.status(200).json({ message: 'Anime removed from list' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all lists of the user with anime count
exports.getUserLists = async (req, res) => {
    const userId = req.userId;
    try {
      const db = await getDBConnection();
      const [lists] = await db.query(`
        SELECT l.id, l.name, COUNT(al.anime_id) as animeCount
        FROM lists l
        LEFT JOIN anime_lists al ON l.id = al.list_id
        WHERE l.user_id = ?
        GROUP BY l.id
      `, [userId]);
  
      // Now fetch anime ids inside each list
      const [animeLists] = await db.query(`
        SELECT list_id, anime_id FROM anime_lists
      `);
  
      const listAnimeMap = {};
  
      animeLists.forEach(row => {
        if (!listAnimeMap[row.list_id]) listAnimeMap[row.list_id] = [];
        listAnimeMap[row.list_id].push(row.anime_id);
      });
  
      const fullLists = lists.map(list => ({
        ...list,
        animeIds: listAnimeMap[list.id] || [],
      }));
  
      res.json(fullLists);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  };
  
 // Get ALL lists created by ALL users, with user name + anime ids
exports.getAllLists = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const db = await getDBConnection();
    
    // 1) Fetch paginated lists + user names
    const [lists] = await db.query(`
      SELECT l.id, l.name, l.user_id, u.username
      FROM lists l
      JOIN users u ON l.user_id = u.id
      ORDER BY l.created_at DESC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    if (lists.length === 0) {
      return res.json([]);
    }

    // 2) Fetch anime_ids for these list_ids
    const listIds = lists.map(list => list.id);
    const [animeLists] = await db.query(`
      SELECT list_id, anime_id
      FROM anime_lists
      WHERE list_id IN (?)
    `, [listIds]);

    const listAnimeMap = {};
    animeLists.forEach(row => {
      if (!listAnimeMap[row.list_id]) listAnimeMap[row.list_id] = [];
      listAnimeMap[row.list_id].push(row.anime_id);
    });

    // 3) Attach animeIds to each list
    const fullLists = lists.map(list => ({
      id: list.id,
      name: list.name,
      username: list.username,
      animeIds: listAnimeMap[list.id] || []
    }));

    // 4) Also fetch total number of lists (for hasMore)
    const [countResult] = await db.query(`SELECT COUNT(*) as total FROM lists`);
    const total = countResult[0]?.total || 0;

    res.json({ lists: fullLists, total });
    console.log("Fetched all lists:", fullLists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
