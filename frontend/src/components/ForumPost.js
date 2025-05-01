// frontend/src/components/ForumPost.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Button,
  Avatar,
  IconButton,
  TextField,
  Collapse,
  Chip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  MoreVert,
  ThumbUp,
  Favorite,
  MoodBad,
  SentimentSatisfied,
  Comment,
  Edit,
  Delete,
  Reply
} from '@mui/icons-material';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import ForumComment from './ForumComment';
import './../styles/ForumPost.css';

const ForumPost = ({ post, onUpdate, currentUser }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [newComment, setNewComment] = useState('');
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userReaction, setUserReaction] = useState(null);
  const API_BASE_URL = 'http://localhost:5000/api';
  const openMenu = Boolean(anchorEl);

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleReact = async (reaction) => {
    try {
      await axios.post(`${API_BASE_URL}/forum/posts/${post.id}/react`, { reaction });
      onUpdate();
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/forum/posts/${post.id}/comments`, {
        content: newComment
      });
      setComments([...comments, response.data]);
      setNewComment('');
      setShowComments(true);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/forum/posts/${post.id}`);
      onUpdate();
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdatePost = async () => {
    try {
      await axios.put(`${API_BASE_URL}/forum/posts/${post.id}`, {
        content: editedContent
      });
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const isOwner = post.user.username === currentUser;

  return (
    <Box className="forum-post-container">
      {/* Post Header */}
      <Box className="post-header">
        <Box className="user-info">
          <Avatar
            src={post.user.profilePic || '/AnimeGirl.png'}
            alt={post.user.username}
            className="user-avatar"
          />
          <Box className="user-details">
            <Typography variant="subtitle1" className="username">
              {post.user.username}
            </Typography>
            <Typography variant="caption" className="post-time">
            {formatDistanceToNow(new Date(post.createdAt || Date.now()))} ago
            </Typography>
          </Box>
        </Box>

        {isOwner && (
          <Box className="post-actions">
            <IconButton onClick={handleMenuClick} className="menu-button">
              <MoreVert />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              className="post-menu"
            >
              <MenuItem onClick={() => { setEditing(true); handleMenuClose(); }}>
                <Edit fontSize="small" className="menu-icon" /> Edit
              </MenuItem>
              <MenuItem onClick={handleDeletePost}>
                <Delete fontSize="small" className="delete-icon" /> Delete
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      {/* Post Title */}
      <Typography variant="h6" className="post-title">
        {post.title}
      </Typography>

      {/* Post Content */}
      {editing ? (
        <Box className="edit-container">
          <TextField
            fullWidth
            multiline
            rows={3}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="edit-field"
          />
          <Box className="edit-buttons">
            <Button
              variant="contained"
              onClick={handleUpdatePost}
              className="save-button"
            >
              Save
            </Button>
            <Button
              variant="outlined"
              onClick={() => setEditing(false)}
              className="cancel-button"
            >
              Cancel
            </Button>
          </Box>
        </Box>
      ) : (
        <Typography variant="body1" className="post-content">
          {post.content}
        </Typography>
      )}

      {/* Tags */}
      <Box className="tags-container">
        {post.tags.map(tag => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            className="post-tag"
          />
        ))}
      </Box>

      {/* Reactions */}
      <Box className="reactions-container">
        {[
          { type: 'like', icon: <ThumbUp fontSize="small" />, color: '#00f0ff' },
          { type: 'love', icon: <Favorite fontSize="small" />, color: '#ff4081' },
          { type: 'haha', icon: <SentimentSatisfied fontSize="small" />, color: '#ffeb3b' },
          { type: 'sad', icon: <MoodBad fontSize="small" />, color: '#9c27b0' }
        ].map((reaction) => (
          <Box key={reaction.type} className="reaction-item">
            <IconButton
              onClick={() => handleReact(reaction.type)}
              className="reaction-button"
              sx={{ color: reaction.color }}
            >
              {reaction.icon}
            </IconButton>
            <Typography variant="caption" className="reaction-count">
              {post.reactions?.[reaction.type] || 0}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Comments Section */}
      <Box className="comments-section">
        <Button
          startIcon={<Comment />}
          onClick={() => setShowComments(!showComments)}
          className="comments-toggle"
        >
          {comments.length > 0 ? `View Comments (${comments.length})` : 'Add Comment'}
        </Button>

        <Collapse in={showComments} className="comments-collapse">
          <Box className="comments-container">
            {/* Add Comment */}
            <Box className="add-comment">
              <Avatar
                src={localStorage.getItem('profilePic') || '/AnimeGirl.png'}
                className="comment-avatar"
              />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Write a comment..."
                size="small"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                className="comment-input"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={handleAddComment} className="submit-comment">
                      <Reply />
                    </IconButton>
                  ),
                }}
              />
            </Box>

            {/* Comments List */}
            {comments.map(comment => (
              <ForumComment
                key={comment.id}
                comment={comment}
                currentUser={currentUser}
                onUpdate={onUpdate}
              />
            ))}
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

ForumPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      profilePic: PropTypes.string
    }).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    reactions: PropTypes.object,
    comments: PropTypes.array
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  currentUser: PropTypes.string.isRequired
};

export default ForumPost;