import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import ForumPostForm from '../components/ForumPostForm';
import ForumPost from '../components/ForumPost';
import ForumPagination from '../components/ForumPagination';
import ForumTagFilter from '../components/ForumTagFilter';
import axios from 'axios';
import Navbar from "../components/Navbar";
import '../styles/Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [filterTag, setFilterTag] = useState('');
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  const postsPerPage = 10;

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/forum`, {
          params: {
            offset: (currentPage - 1) * postsPerPage,
            limit: postsPerPage,
            tag: filterTag,
            user: showMyPosts ? username : null
          },
          withCredentials: true,
          signal: signal
        });
        setPosts(response.data.posts);
        setTotalPosts(response.data.total);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching forum posts:', error);
          setError(error.response?.data?.error || 'Failed to load posts. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    return () => controller.abort();
  }, [currentPage, filterTag, showMyPosts, username, postsPerPage]);

  const handlePostCreated = () => {
    setCurrentPage(1);
  };

  const handleTagFilter = (tag) => {
    setFilterTag(tag);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterTag('');
    setShowMyPosts(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  return (
    <Box>
      <Navbar />
      <Box className="forum-container">
        <Typography variant="h4" gutterBottom className="forum-title">
          Community Forum
        </Typography>

        <ForumPostForm onPostCreated={handlePostCreated} />

        <Box className="forum-controls">
          <ForumTagFilter onTagSelect={handleTagFilter} />
          <Button
            variant="outlined"
            onClick={() => setShowMyPosts(!showMyPosts)}
            className="my-posts-button"
            disabled={showMyPosts && !username}
          >
            {showMyPosts ? 'Show All Posts' : 'View My Posts'}
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom className="forum-subtitle">
          {filterTag ? `Posts tagged with "${filterTag}"` :
           showMyPosts ? 'Your Posts' : 'Explore Forum Discussions'}
        </Typography>

        {loading ? (
          <Box className="loading-container">
            <CircularProgress className="loading-spinner" />
          </Box>
        ) : (
          <>
            {posts.length === 0 ? (
              <Box className="empty-state">
                <Typography variant="body1" className="no-posts-message">
                  {showMyPosts
                    ? "You haven't created any posts yet!"
                    : filterTag
                      ? `No posts found with tag "${filterTag}"`
                      : 'No posts found. Be the first to start a discussion!'}
                </Typography>
                {(filterTag || showMyPosts) && (
                  <Button
                    variant="contained"
                    onClick={handleClearFilters}
                    sx={{ mt: 2 }}
                  >
                    Clear Filters
                  </Button>
                )}
              </Box>
            ) : (
              posts.map(post => (
                <ForumPost
                  key={post.id}
                  post={post}
                  onUpdate={() => {
                    // Refresh posts while maintaining current filters
                    setCurrentPage(1);
                  }}
                  currentUser={username}
                />
              ))
            )}

            {totalPages > 1 && (
              <ForumPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Forum;