import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Skeleton,
  Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [trendingNow, setTrendingNow] = useState([]);
  const [allTimeFavorites, setAllTimeFavorites] = useState([]);
  const [popularThisSeason, setPopularThisSeason] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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
                genres
                averageScore
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
                genres
                averageScore
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
                genres
                averageScore
              }
            }
          }
        `;

        const [trendingData, favoritesData, popularData] = await Promise.all([
          fetchAniListData(trendingQuery),
          fetchAniListData(favoritesQuery),
          fetchAniListData(popularQuery)
        ]);

        setTrendingNow(trendingData.Page.media);
        setAllTimeFavorites(favoritesData.Page.media);
        setPopularThisSeason(popularData.Page.media);
      } catch (error) {
        console.error("Error fetching anime data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchAniListData = async (query, variables = {}) => {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

  const renderSectionHeading = (title, icon) => (
    <Box className="section-heading">
      {icon}
      <Typography variant="h5" className="section-title">
        {title}
      </Typography>
    </Box>
  );

  const renderCards = (data, isLoading) => (
    <Grid container spacing={3} justifyContent="flex-start">
      {isLoading
        ? Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card className="skeleton-card">
                <Skeleton variant="rectangular" height={200} animation="wave" />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="100%" />
                </CardContent>
              </Card>
            </Grid>
          ))
        : data.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={item.id}>
              <Card
                onClick={() => handleCardClick(item.id)}
                className="anime-card"
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={item.coverImage.large}
                  alt={item.title.english || item.title.romaji}
                  className="card-media"
                />
                <CardContent  className="card-content">
                  <Typography
                    variant="subtitle1"
                    component="div"
                    className="anime-title"
                  >
                    {item.title.english || item.title.romaji}
                  </Typography>
                  
                  {item.genres && item.genres.length > 0 && (
                    <Box className="genre-container">
                      {item.genres.slice(0, 2).map((genre) => (
                        <Chip 
                          key={genre} 
                          label={genre} 
                          size="small"
                          className="genre-chip"
                        />
                      ))}
                    </Box>
                  )}
                  
                  {item.averageScore && (
                    <Box className="score-container">
                      <StarIcon className="star-icon" />
                      <Typography variant="body2" className="score-text">
                        {item.averageScore / 10}/10
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography
                    variant="body2"
                    className="anime-description"
                  >
                    {item.description?.replace(/<[^>]*>/g, "") || "No description available."}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
    </Grid>
  );

  return (
    <Box className="home-container">
      <Navbar />
      <Container maxWidth="xl" className="content-container">
        {renderSectionHeading("Trending Now", <TrendingUpIcon className="trending-icon"  />)}
        {renderCards(trendingNow, loading)}

        {renderSectionHeading("All-Time Favorites", <FavoriteIcon className="favorites-icon"  />)}
        {renderCards(allTimeFavorites, loading)}

        {renderSectionHeading("Popular This Season", <StarIcon className="popular-icon"  />)}
        {renderCards(popularThisSeason, loading)}
      </Container>
    </Box>
  );
};

export default Home;