import {
  Favorite as FavoriteIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Whatshot as HotIcon
} from "@mui/icons-material";
import { FaAngleDoubleRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import {
  Box,
  Card,
  Button,  
  CardContent,
  CardMedia,
  Chip,
  Container,
  Grid,
  Skeleton,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
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
  const [topAnime, setTopAnime] = useState([]);
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

  useEffect(() => {
    const fetchTopAnime = async () => {
      setLoading(true);
      try {
        const query = `
          query {
            Page(page: 1, perPage: 100) {
              media(sort: SCORE_DESC, type: ANIME) {
                id
                title {
                  romaji
                  english
                }
                coverImage {
                  large
                }
                averageScore
                episodes
                duration
                status
                startDate {
                  year
                  month
                  day
                }
                season
                genres
                studios {
                  nodes {
                    name
                  }
                }
              }
            }
          }
        `;

        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();
        setTopAnime(data.data.Page.media);
      } catch (error) {
        console.error("Error fetching top anime:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopAnime();
  }, []);


  const formatDate = (startDate) => {
    if (!startDate.year) return "Unknown";
    return `${startDate.year}-${startDate.month || "??"}-${startDate.day || "??"}`;
  };

  const formatSeason = (season, year) => {
    if (!season || !year) return "Unknown";
    return `${season} ${year}`;
  };

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
      <Container maxWidth="xxl" className="content-container">
        {renderSectionHeading("Trending Now", <TrendingUpIcon className="trending-icon"  />)}
        {renderCards(trendingNow, loading)}

        {renderSectionHeading("All-Time Favorites", <FavoriteIcon className="favorites-icon"  />)}
        {renderCards(allTimeFavorites, loading)}

        {renderSectionHeading("Popular This Season", <StarIcon className="popular-icon"  />)}
        {renderCards(popularThisSeason, loading)}
        
        <Box sx={{ mb: 4 }}>
     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
     <Box className="section-heading">
          <HotIcon className="trending-icon" />
          <Typography variant="h4" className="section-title">
            TOP 50 ANIME
          </Typography>
        </Box>
        <Button component={Link}
      to="/top-anime"
  startIcon={<ArrowForwardIcon sx={{ color: 'white' }} />} 
  sx={{ 
    mb: 2,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    backgroundColor: 'rgb(182, 73, 0)', // Pink base color
    
    borderRadius: '20px',
    px: 3,
    py: 1,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    '&:hover': {
      backgroundImage: 'linear-gradient(45deg, rgba(255,105,180,1) 0%, rgba(100,200,255,1) 50%, rgba(100,255,200,1) 100%)',
      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
      transform: 'translateY(-2px)'
    },
    '&:active': {
      transform: 'translateY(0)'
    },
    transition: 'all 0.3s ease'
  }}
>
  View All
</Button>
  </Box>

  <List>
    {topAnime.slice(0, 10).map((anime, index) => (
      <React.Fragment key={anime.id}>
        <ListItem>
          <ListItemAvatar>
            <Avatar 
              variant="square" 
              src={anime.coverImage.large} 
              sx={{ width: 60, height: 90, mr: 2 }} 
            />
          </ListItemAvatar>
          <ListItemText
  sx={{
    '& .MuiListItemText-primary': {  // Styles for primary text
      color: 'rgba(43, 209, 238, 0.7)',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    '& .MuiListItemText-secondary': {  // Styles for secondary text
      color: 'rgba(39, 156, 39, 0.7)',
      fontSize: '0.9rem'
    }
  }}
  primary={`${index + 1}. ${anime.title.romaji || anime.title.english}`}
  secondary={
    <Typography component="span">
      Score: {anime.averageScore ? (anime.averageScore/10).toFixed(1) : "N/A"}
    </Typography>
  }
/>
        </ListItem>
        {index < topAnime.length - 1 && <Divider />}
      </React.Fragment>
    ))}
  </List>
</Box>
      </Container>
    </Box>
  );
};

export default Home;