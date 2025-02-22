import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';

const Home = () => {
    const navigate = useNavigate();
    const [trendingNow, setTrendingNow] = useState([]);
    const [allTimeFavorites, setAllTimeFavorites] = useState([]);
    const [popularThisSeason, setPopularThisSeason] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const trendingQuery = `
                query {
                  Page(page: 1, perPage: 6) {
                    media(sort: TRENDING_DESC, type: ANIME) {
                      id
                      title {
                        english
                        romaji
                      }
                      coverImage {
                        large
                      }
                      description
                    }
                  }
                }
            `;
            const favoritesQuery = `
                query {
                  Page(page: 1, perPage: 6) {
                    media(sort: FAVOURITES_DESC, type: ANIME) {
                      id
                      title {
                        english
                        romaji
                      }
                      coverImage {
                        large
                      }
                      description
                    }
                  }
                }
            `;
            const popularQuery = `
                query {
                  Page(page: 1, perPage: 6) {
                    media(season: FALL, seasonYear: 2024, sort: POPULARITY_DESC, type: ANIME) {
                      id
                      title {
                        english
                        romaji
                      }
                      coverImage {
                        large
                      }
                      description
                    }
                  }
                }
            `;

            const trendingData = await fetchAniListData(trendingQuery);
            const favoritesData = await fetchAniListData(favoritesQuery);
            const popularData = await fetchAniListData(popularQuery);

            setTrendingNow(trendingData.Page.media);
            setAllTimeFavorites(favoritesData.Page.media);
            setPopularThisSeason(popularData.Page.media);
        };

        fetchData();
    }, []);

    const fetchAniListData = async (query, variables = {}) => {
        const response = await fetch('https://graphql.anilist.co', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query, variables }),
        });
        const data = await response.json();
        return data.data;
    };

    // For navigating to AnimeDetails.js with anime ID
    const handleCardClick = (id) => {
      navigate(`/anime/${id}`);
  };

  const renderCards = (data) => (
    <Grid container spacing={2} justifyContent="center">
        {data.map((item) => (
            <Grid item xs={12} sm={3.9} md={1.59} key={item.id}>
                <div onClick={() => handleCardClick(item.id)} style={{ cursor: 'pointer' }}>
                    <Card sx={{ maxWidth: 351, backgroundColor: '#1e1e1e', color: '#fff', borderRadius: '6px' }}>
                        <CardMedia
                            component="img"
                            height="264"
                            image={item.coverImage.large}
                            alt={(item.title.english || item.title.romaji).length > 15
                              ? (item.title.english || item.title.romaji).substring(0, 15) + "..."
                              : item.title.english || item.title.romaji}
                        />
                        <CardContent>
                        <Typography
                            variant="subtitle1"
                            component="div"
                            sx={{ fontWeight: 900, color: "#d3d3ff", marginTop: '-2.7px', fontFamily: 'Quicksand', fontSize: '14.4px', WebkitTextStroke: '0.27px #bf00ff' }}
                        >
                            {(item.title.english || item.title.romaji).length > 15
                                ? (item.title.english || item.title.romaji).substring(0, 15) + "..."
                                : item.title.english || item.title.romaji}
                        </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, color: '#ccc', lineHeight: 1.2, marginTop: '1.5px', display: 'block', fontFamily: 'Quicksand', fontSize: '10.2px', textAlign: 'justify' }}>
                                {item.description?.substring(0, 45)}...
                            </Typography>
                        </CardContent>
                    </Card>
                </div>
            </Grid>
        ))}
    </Grid>
);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#121212', paddingLeft: '21px', paddingRight: '21px', color: '#fff' }}>
            <Navbar />
            <div style={{ marginTop: '54px' }}>
                <Typography variant="h4" sx={{
                    fontSize: '2.22rem',
                    fontWeight: 500,
                    fontFamily: '"Kalam", cursive',
                    color: '#ffffff',
                    marginLeft: '72px',
                    marginBottom: '18px',
                    WebkitTextStroke: '0.54px #ff00ff',
                    textShadow: '0 0 8px #9a00cc, 0 0 12px #9a00cc, 0 0 18px #9a00cc, 0 0 20px #9a00cc'
                }} gutterBottom>
                    Trending Now
                </Typography>
                {renderCards(trendingNow)}

                <Typography variant="h4" sx={{
                    fontSize: '2.22rem',
                    fontWeight: 500,
                    fontFamily: '"Kalam", cursive',
                    color: '#fff',
                    marginLeft: '72px',
                    marginBottom: '18px',
                    WebkitTextStroke: '0.42px #00f0ff',
                    textShadow: '0 0 8px #00a1d9, 0 0 12px #00a1d9, 0 0 16px #00a1d9, 0 0 20px #00a1d9'
                }} gutterBottom style={{ marginTop: '63px' }}>
                    All-Time Favorites
                </Typography>
                {renderCards(allTimeFavorites)}

                <Typography variant="h4" sx={{
                    fontSize: '2.22rem',
                    fontWeight: 500,
                    fontFamily: '"Kalam", cursive',
                    color: '#ccffff',
                    marginLeft: '72px',
                    marginBottom: '18px',
                    WebkitTextStroke: '0.48px rgb(14, 148, 237)',
                    textShadow: '0 0 4px rgba(55, 185, 255, 0.9), 0 0 8px rgba(9, 169, 255, 0.84), 0 0 17px rgba(183, 128, 255, 0.9), 0 0 20px rgba(126, 27, 255, 0.9)'
                }} gutterBottom style={{ marginTop: '63px' }}>
                    Popular This Season
                </Typography>
                {renderCards(popularThisSeason)}
            </div>
        </div>
    );
};

export default Home;