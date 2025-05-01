// frontend/src/components/ForumPostForm.js
// frontend/src/components/ForumPostForm.js
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  Avatar
} from '@mui/material';
import axios from 'axios';
import { useFormik } from 'formik';
import * as yup from 'yup';
import './../styles/ForumPostForm.css';

const validationSchema = yup.object({
  title: yup.string().required('Title is required').max(100),
  content: yup.string().required('Content is required').max(2000),
});

const ForumPostForm = ({ onPostCreated }) => {
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const username = localStorage.getItem('username');
  const profilePic = localStorage.getItem('profilePic') || '/AnimeGirl.png';

  const API_BASE_URL = 'http://localhost:5000/api';

  const formik = useFormik({
    initialValues: {
      title: '',
      content: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(`${API_BASE_URL}/forum`, {
          title: values.title,
          content: values.content,
          tags: tags,
        }, { withCredentials: true });
        formik.resetForm();
        setTags([]);
        onPostCreated();
      } catch (error) {
        console.error('Error creating post:', error);
      }
    },
  });

  const handleAddTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="forum-post-form">
      <Typography variant="h6" className="form-title">
        Create a New Discussion
      </Typography>

      <Box className="user-info-container">
        <Avatar
          src={profilePic}
          alt={username}
          className="user-avatar"
          onError={(e) => { e.target.src = '/AnimeGirl.png'; }}
        />
        <Typography variant="subtitle1" className="username-text">
          Posting as {username}
        </Typography>
      </Box>

      <TextField
        fullWidth
        id="title"
        name="title"
        label="Post Title"
        variant="outlined"
        value={formik.values.title}
        onChange={formik.handleChange}
        error={formik.touched.title && Boolean(formik.errors.title)}
        helperText={formik.touched.title && formik.errors.title}
        className="form-field"
        InputProps={{ className: "form-input" }}
        InputLabelProps={{ className: "form-label" }}
      />

      <TextField
        fullWidth
        id="content"
        name="content"
        label="What's on your mind?"
        variant="outlined"
        multiline
        rows={4}
        value={formik.values.content}
        onChange={formik.handleChange}
        error={formik.touched.content && Boolean(formik.errors.content)}
        helperText={formik.touched.content && formik.errors.content}
        className="form-field"
        InputProps={{ className: "form-input" }}
        InputLabelProps={{ className: "form-label" }}
      />

      <Box className="tags-container">
        <TextField
          fullWidth
          label="Add Tags (press enter to add)"
          variant="outlined"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddTag();
            }
          }}
          className="tag-input-field"
          InputProps={{
            className: "form-input",
            endAdornment: (
              <Button onClick={handleAddTag} className="add-tag-button">
                Add
              </Button>
            ),
          }}
          InputLabelProps={{ className: "form-label" }}
        />

        <Box className="tags-list">
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onDelete={() => handleDeleteTag(tag)}
              className="tag-chip"
            />
          ))}
        </Box>
      </Box>

      <Button type="submit" variant="contained" className="submit-button">
        Post Discussion
      </Button>
    </Box>
  );
};

ForumPostForm.propTypes = {
  onPostCreated: PropTypes.func.isRequired,
};

export default ForumPostForm;