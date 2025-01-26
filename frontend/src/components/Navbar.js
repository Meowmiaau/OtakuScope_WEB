import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear the token
        navigate('/'); // Redirect to the Get Started page
    };

    const handleSearchChange = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            setLoading(true);
            try {
                const response = await axios.post('https://graphql.anilist.co', {
                    query: `
                    query ($search: String) {
                        Page(page: 1, perPage: 10) {
                            media(search: $search, type: ANIME) {
                                id
                                title {
                                    romaji
                                }
                                coverImage {
                                    medium
                                }
                            }
                        }
                    }
                    `,
                    variables: { search: query },
                });

                const results = response.data.data.Page.media;
                setSearchResults(results);
            } catch (error) {
                console.error('Error fetching anime:', error);
                setSearchResults([]);
            } finally {
                setLoading(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleResultClick = (id) => {
        navigate(`/${id}`); // Redirect to the detailed anime page
        setSearchQuery('');
        setSearchResults([]);
    };

    return (
        <AppBar position="static" style={{ backgroundColor: '#121212' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    OtakuScope
                </Typography>
                <Box sx={{ flexGrow: 1, mx: 2, position: 'relative' }}>
                    <TextField
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Anime..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            endAdornment: loading && <CircularProgress size={20} />,
                        }}
                    />
                    {searchResults.length > 0 && (
                        <List
                            sx={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                maxHeight: '200px',
                                overflowY: 'auto',
                                backgroundColor: 'white',
                                zIndex: 10,
                                color: 'black',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                            }}
                        >
                            {searchResults.map((anime) => (
                                <ListItem
                                    button
                                    key={anime.id}
                                    onClick={() => handleResultClick(anime.id)}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={anime.coverImage.medium} alt={anime.title.romaji} />
                                    </ListItemAvatar>
                                    <ListItemText primary={anime.title.romaji} />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button color="inherit" component={Link} to="/home" sx={{ marginRight: 2 }}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/myanime" sx={{ marginRight: 2 }}>
                        MyAnime
                    </Button>
                    <Button color="inherit" component={Link} to="/lists" sx={{ marginRight: 2 }}>
                        Lists
                    </Button>
                    <Button color="inherit" component={Link} to="/profile" sx={{ marginRight: 2 }}>
                        Profile
                    </Button>
                    <Button color="inherit" component={Link} to="/forum" sx={{ marginRight: 2 }}>
                        Forum
                    </Button>
                    <Button color="secondary" onClick={handleLogout} variant="outlined" sx={{ marginLeft: 2 }}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
