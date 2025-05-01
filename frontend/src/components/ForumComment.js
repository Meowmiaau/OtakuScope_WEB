import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Divider,
  Button
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Reply
} from '@mui/icons-material';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import './../styles/ForumComment.css';

const ForumComment = ({ comment, currentUser, onUpdate, isReply = false }) => {
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const API_BASE = '/api/forum/posts';

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleUpdateComment = async () => {
    try {
      await axios.put(`${API_BASE}/${comment.post_id}/comments/${comment.id}`, {
        content: editedContent
      });
      setEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await axios.delete(`${API_BASE}/${comment.post_id}/comments/${comment.id}`);
      onUpdate();
      handleMenuClose();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleAddReply = async () => {
    if (!replyContent.trim()) return;

    try {
      await axios.post(`${API_BASE}/${comment.post_id}/comments/${comment.id}/replies`, {
        content: replyContent
      });
      setReplyContent('');
      setReplying(false);
      onUpdate();
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const isOwner = comment.user?.username === currentUser;

  return (
    <Box className="comment-container">
      <Box className="comment-header">
        <Box className="comment-user-info">
          <Avatar
            src={comment.user?.profilePic || '/AnimeGirl.png'}
            alt={comment.user?.username || 'Unknown'}
            className="comment-avatar"
          />
          <Box className="comment-content-container">
            <Typography variant="subtitle2" className="comment-username">
              {comment.user?.username || 'Unknown User'}
            </Typography>
            {editing ? (
              <Box className="edit-comment-container">
                <TextField
                  fullWidth
                  multiline
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="edit-comment-field"
                />
                <Box className="edit-comment-buttons">
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleUpdateComment}
                    className="save-comment-button"
                  >
                    Save
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setEditing(false)}
                    className="cancel-comment-button"
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" className="comment-text">
                {comment.content}
              </Typography>
            )}
            <Typography variant="caption" className="comment-time">
              {formatDistanceToNow(new Date(comment.createdAt + 'Z'))}
            </Typography>
          </Box>
        </Box>

        {isOwner && (
          <Box className="comment-actions">
            <IconButton
              size="small"
              onClick={handleMenuClick}
              className="comment-menu-button"
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleMenuClose}
              className="comment-dropdown-menu"
            >
              <MenuItem onClick={() => { setEditing(true); handleMenuClose(); }}>
                <Edit fontSize="small" className="menu-edit-icon" /> Edit
              </MenuItem>
              <MenuItem onClick={handleDeleteComment}>
                <Delete fontSize="small" className="menu-delete-icon" /> Delete
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>

      <Box className="replies-container">
        {!isReply && (
          <Button
            size="small"
            startIcon={<Reply fontSize="small" />}
            onClick={() => setReplying(!replying)}
            className="reply-toggle-button"
          >
            Reply
          </Button>
        )}

        {replying && (
          <Box className="reply-form-container">
            <Avatar
              src={localStorage.getItem('profilePic') || '/default-avatar.png'}
              className="reply-avatar"
            />
            <Box className="reply-input-container">
              <TextField
                fullWidth
                multiline
                size="small"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddReply();
                  }
                }}
                className="reply-input-field"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={handleAddReply}
                      className="submit-reply-button"
                    >
                      <Reply fontSize="small" />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Box>
        )}

        {comment.replies && !isReply && comment.replies.map(reply => (
          <ForumComment
            key={reply.id}
            comment={reply}
            currentUser={currentUser}
            onUpdate={onUpdate}
            isReply={true}
          />
        ))}
      </Box>
      <Divider className="comment-divider" />
    </Box>
  );
};

ForumComment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.string.isRequired,
    post_id: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string,
      profilePic: PropTypes.string
    }),
    replies: PropTypes.array
  }).isRequired,
  currentUser: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  isReply: PropTypes.bool
};

export default ForumComment;
