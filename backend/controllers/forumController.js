// backend/controllers/forumController.js
const { getDBConnection } = require('../config/db');

// Create a new forum post
exports.createPost = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { title, content, tags } = req.body;
        const user_id = req.userId;

        // Insert the post
        const [result] = await conn.query(
            'INSERT INTO forum_posts (user_id, title, content) VALUES (?, ?, ?)',
            [user_id, title, content]
        );
        const postId = result.insertId;

        // Process tags
        if (tags && tags.length > 0) {
            for (const tagName of tags) {
                // Check if tag exists
                let [tag] = await conn.query(
                    'SELECT id FROM forum_tags WHERE name = ?',
                    [tagName]
                );

                // Create tag if it doesn't exist
                if (tag.length === 0) {
                    [tag] = await conn.query(
                        'INSERT INTO forum_tags (name) VALUES (?)',
                        [tagName]
                    );
                    tag = [{ id: tag.insertId }];
                }

                // Link tag to post
                await conn.query(
                    'INSERT INTO forum_post_tags (post_id, tag_id) VALUES (?, ?)',
                    [postId, tag[0].id]
                );
            }
        }

        res.status(201).json({ message: 'Post created successfully', postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.release();
    }
};

// Get all forum posts (with optional tag filter)
exports.getPosts = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { tag, offset = 0, limit = 10 } = req.query;

        let query = `
            SELECT fp.*, u.username, u.profile_picture,
            GROUP_CONCAT(ft.name) as tags,
            (SELECT COUNT(*) FROM comments c WHERE c.post_id = fp.id) as comment_count,
            (SELECT COUNT(*) FROM post_likes pl WHERE pl.post_id = fp.id) as like_count
            FROM forum_posts fp
            JOIN users u ON fp.user_id = u.id
            LEFT JOIN forum_post_tags fpt ON fp.id = fpt.post_id
            LEFT JOIN forum_tags ft ON fpt.tag_id = ft.id
        `;

        const params = [];

        if (tag) {
            query += ' WHERE ft.name = ?';
            params.push(tag);
        }

        query += `
            GROUP BY fp.id
            ORDER BY fp.created_at DESC
            LIMIT ? OFFSET ?
        `;
        params.push(parseInt(limit), parseInt(offset));

        const [posts] = await conn.query(query, params);

        // Get total count for pagination
        let countQuery = 'SELECT COUNT(DISTINCT fp.id) as total FROM forum_posts fp';
        if (tag) {
            countQuery += ' JOIN forum_post_tags fpt ON fp.id = fpt.post_id JOIN forum_tags ft ON fpt.tag_id = ft.id WHERE ft.name = ?';
        }
        const [[{ total }]] = await conn.query(countQuery, tag ? [tag] : []);

        res.json({ posts, total });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.release();
    }
};

// Get a single post with comments and reactions
exports.getPostDetails = async (req, res) => {
    let conn;
    try {
        // Get connection with proper error handling
        conn = await getDBConnection();
        if (!conn) {
            throw new Error('Failed to get database connection');
        }

        const { id } = req.params;

        // 1. Get post details
        const [postResult] = await conn.query(`
            SELECT fp.*, u.username, u.profile_picture,
            GROUP_CONCAT(ft.name) as tags
            FROM forum_posts fp
            JOIN users u ON fp.user_id = u.id
            LEFT JOIN forum_post_tags fpt ON fp.id = fpt.post_id
            LEFT JOIN forum_tags ft ON fpt.tag_id = ft.id
            WHERE fp.id = ?
            GROUP BY fp.id
        `, [id]);

        const post = postResult[0]; // Safely access first result
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // 2. Get comments
        const [comments] = await conn.query(`
            SELECT c.*, u.username, u.profile_picture
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = ?
            ORDER BY c.created_at DESC
        `, [id]);

        // 3. Get reactions
        const [reactions] = await conn.query(`
            SELECT pl.*, u.username
            FROM post_likes pl
            JOIN users u ON pl.user_id = u.id
            WHERE pl.post_id = ?
        `, [id]);

        res.json({
            post,
            comments,
            reactions
        });
    } catch (error) {
        console.error('Error fetching post details:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    } finally {
        if (conn && typeof conn.release === 'function') {
            conn.release();
        }
    }
};

// Add reaction to a post
exports.addReaction = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { post_id, reaction_type } = req.body;
        const user_id = req.userId;

        // Check if user already reacted
        const [existing] = await conn.query(
            'SELECT * FROM post_likes WHERE user_id = ? AND post_id = ?',
            [user_id, post_id]
        );

        if (existing.length > 0) {
            // Update existing reaction
            await conn.query(
                'UPDATE post_likes SET reaction_type = ? WHERE id = ?',
                [reaction_type, existing[0].id]
            );
        } else {
            // Add new reaction
            await conn.query(
                'INSERT INTO post_likes (user_id, post_id, reaction_type) VALUES (?, ?, ?)',
                [user_id, post_id, reaction_type]
            );
        }

        res.status(200).json({ message: 'Reaction updated successfully' });
    } catch (error) {
        console.error('Error adding reaction:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.release();
    }
};

// Add comment to a post
exports.addComment = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { post_id, content } = req.body;
        const user_id = req.userId;

        const [result] = await conn.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)',
            [post_id, user_id, content]
        );

        res.status(201).json({
            message: 'Comment added successfully',
            commentId: result.insertId
        });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.release();
    }
};

// Delete a post
exports.deletePost = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { id } = req.params;
        const user_id = req.userId;

        // Verify post belongs to user
        const [post] = await conn.query(
            'SELECT * FROM forum_posts WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (post.length === 0) {
            return res.status(403).json({ error: 'Unauthorized to delete this post' });
        }

        await conn.query('DELETE FROM forum_posts WHERE id = ?', [id]);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.release();
    }
};

// Filter posts by tags
exports.getTags = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const [tags] = await conn.query(`
            SELECT ft.id, ft.name, COUNT(fpt.post_id) as postCount
            FROM forum_tags ft
            LEFT JOIN forum_post_tags fpt ON ft.id = fpt.tag_id
            GROUP BY ft.id
        `);
        res.json(tags);
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.release();
    }
};


exports.updatePost = async (req, res) => {
    let conn;
    try {
        conn = await getDBConnection();
        const { id } = req.params;
        const { title, content } = req.body;
        const user_id = req.userId;

        // Verify post belongs to user
        const [post] = await conn.query(
            'SELECT * FROM forum_posts WHERE id = ? AND user_id = ?',
            [id, user_id]
        );

        if (post.length === 0) {
            return res.status(403).json({ error: 'Unauthorized to edit this post' });
        }

        await conn.query(
            'UPDATE forum_posts SET title = ?, content = ? WHERE id = ?',
            [title, content, id]
        );

        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    } finally {
        if (conn) conn.release();
    }
};