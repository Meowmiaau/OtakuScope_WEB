import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Grid, 
  Container, 
  Box,
  Skeleton,
  Chip
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";

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
    <Box 
      display="flex" 
      alignItems="center" 
      mb={3} 
      mt={6} 
      borderLeft="4px solid #6200ea"
      pl={2}
    >
      {icon}
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          fontFamily: '"Roboto", sans-serif',
          color: "#fff",
          ml: 1
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  const renderCards = (data, isLoading) => (
    <Grid container spacing={3} justifyContent="flex-start">
      {isLoading
        ? Array.from(new Array(6)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Card sx={{ height: "100%", bgcolor: "#1e1e1e" }}>
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
                sx={{
                  height: "100%",
                  bgcolor: "#1e1e1e",
                  color: "#fff",
                  borderRadius: "8px",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                  },
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={item.coverImage.large}
                  alt={item.title.english || item.title.romaji}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography
                    variant="subtitle1"
                    component="div"
                    sx={{
                      fontWeight: 700,
                      color: "#d3d3ff",
                      fontFamily: "Quicksand, sans-serif",
                      fontSize: "16px",
                      mb: 1,
                      height: "48px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {item.title.english || item.title.romaji}
                  </Typography>
                  
                  {item.genres && item.genres.length > 0 && (
                    <Box mb={1} sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {item.genres.slice(0, 2).map((genre) => (
                        <Chip 
                          key={genre} 
                          label={genre} 
                          size="small"
                          sx={{ 
                            bgcolor: "rgba(98, 0, 234, 0.2)", 
                            color: "#a387ff",
                            fontSize: "10px",
                            height: "24px"
                          }} 
                        />
                      ))}
                    </Box>
                  )}
                  
                  {item.averageScore && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <StarIcon sx={{ color: "#ffc107", fontSize: "16px", mr: 0.5 }} />
                      <Typography variant="body2" sx={{ color: "#ffc107" }}>
                        {item.averageScore / 10}/10
                      </Typography>
                    </Box>
                  )}
                  
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#aaa",
                      fontSize: "12px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
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
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#121212",
        color: "#fff",
      }}
    >
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 8, pb: 8 }}>
        {renderSectionHeading("Trending Now", <TrendingUpIcon sx={{ color: "#6200ea" }} />)}
        {renderCards(trendingNow, loading)}

        {renderSectionHeading("All-Time Favorites", <FavoriteIcon sx={{ color: "#6200ea" }} />)}
        {renderCards(allTimeFavorites, loading)}

        {renderSectionHeading("Popular This Season", <StarIcon sx={{ color: "#6200ea" }} />)}
        {renderCards(popularThisSeason, loading)}
      </Container>
    </Box>
  );
};

export default Home;