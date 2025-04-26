import React, { useState, useRef, useEffect } from 'react';
import { AppBar, Toolbar, Button, Box, TextField, CircularProgress, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    const navbarRef = useRef(null);

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

    // Close search results if clicked outside the navbar
    useEffect(() => {
        const handleClickOutside = (event) => { // Removed type annotation
            if (navbarRef.current && !navbarRef.current.contains(event.target)) { // Removed type assertion
                setSearchResults([]); // Close search results
                setSearchQuery(''); // Optionally reset the search query
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <AppBar position="static" style={{ backgroundColor: '#121212' }} ref={navbarRef}>
            <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
                <img
                    src="\OtakuLOGO.png"  // Update the path to where your image is stored
                    alt="OtakuScope"
                    style={{ height: '48px' }} // Adjust height as necessary
                />
            </Box>
                <Box sx={{ flexGrow: 1, mx: 2, position: 'relative' }}>
                    <TextField
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Anime..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        InputProps={{
                            endAdornment: (
                                <>
                                    {loading ? (
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: '#00f0ff',
                                            }}
                                        />
                                    ) : (
                                        <SearchIcon sx={{
                                            color: '#00f0ff'
                                        }} />
                                    )}
                                </>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderColor: '#00f0ff',
                                boxShadow: '0 0 3px rgba(0, 240, 255, 0.2)',
                                '&:hover': {
                                    boxShadow: '0 0 5px rgba(55, 185, 255, 0.54), 0 0 8px rgba(9, 169, 255, 0.42)',
                                },
                                '&.Mui-focused': {
                                    borderColor: '#00f0ff',
                                    boxShadow: '0 0 4px rgba(55, 185, 255, 0.66), 0 0 6px rgba(9, 169, 255, 0.6), 0 0 8px rgba(183, 128, 255, 0.57)',
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#00f0ff',
                                },
                            },
                            '& .MuiOutlinedInput-input': {
                                color: '#00f0ff',
                                fontWeight: 600,
                                fontFamily: '"Kalam", cursive',
                            }
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
                                border: '1px solid #121212',
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
                    <Button color="inherit" component={Link} to="/home" sx={{
                        marginRight: 2,
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 600,
                        transition: "color 0.15s ease-in-out",
                        '&:hover': { color: '#bf00ff' }
                    }}>
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/myanime" sx={{
                        marginRight: 2,
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 600,
                        transition: "color 0.15s ease-in-out",
                        '&:hover': { color: '#bf00ff' }
                    }}>
                        MyAnime
                    </Button>
                    <Button color="inherit" component={Link} to="/lists" sx={{
                        marginRight: 2,
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 600,
                        transition: "color 0.15s ease-in-out",
                        '&:hover': { color: '#bf00ff' }
                    }}>
                        Lists
                    </Button>
                    <Button color="inherit" component={Link} to={`/profile/${username}`} sx={{
                        marginRight: 2,
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 600,
                        transition: "color 0.15s ease-in-out",
                        '&:hover': { color: '#bf00ff' }
                    }}>
                        Profile
                    </Button>
                    <Button color="inherit" component={Link} to="/forum" sx={{
                        marginRight: 2,
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 600,
                        transition: "color 0.15s ease-in-out",
                        '&:hover': { color: '#bf00ff' }
                    }}>
                        Forum
                    </Button>
                    <Button color="secondary" onClick={handleLogout} variant="outlined" sx={{
                        marginLeft: 2,
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 700,
                        color: '#bf00ff',
                        borderColor: '#bf00ff',
                        '&:hover': {
                            backgroundColor: 'rgba(191, 0, 255, 0.1)',
                            borderColor: 'rgba(255, 0, 255)',
                            color: '#bf00ff',
                            boxShadow: "0 0 4px rgba(255, 0, 0, 0.6), 0 0 8px rgba(255, 0, 0, 0.45)"
                        }
                    }}>
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
