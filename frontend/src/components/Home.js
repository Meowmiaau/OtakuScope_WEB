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
                  Page(page: 1, perPage: 10) {
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
                  Page(page: 1, perPage: 10) {
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
                  Page(page: 1, perPage: 10) {
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

    const renderCards = (data) => (
        <Grid container spacing={2}>
            {data.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                    <Card sx={{ maxWidth: 345, backgroundColor: '#1e1e1e', color: '#fff' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image={item.coverImage.large}
                            alt={item.title.english || item.title.romaji}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {item.title.english || item.title.romaji}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ color: '#ccc' }}>
                                {item.description?.substring(0, 100)}...
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#121212', padding: '20px', color: '#fff' }}>
            <Navbar />
            <div style={{ marginTop: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    Trending Now
                </Typography>
                {renderCards(trendingNow)}

                <Typography variant="h4" gutterBottom style={{ marginTop: '40px' }}>
                    All-Time Favorites
                </Typography>
                {renderCards(allTimeFavorites)}

                <Typography variant="h4" gutterBottom style={{ marginTop: '40px' }}>
                    Popular This Season
                </Typography>
                {renderCards(popularThisSeason)}
            </div>
        </div>
    );
};

export default Home;
