import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Chip,
  Button,
  Container
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const TopAnime = () => {
  const [topAnime, setTopAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopAnime = async () => {
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
                season
                startDate {
                  year
                }
                genres
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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ 
      backgroundColor: 'rgb(18, 18, 18)', // Dark background
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="xxl">
      <Button 
  startIcon={<ArrowBackIcon sx={{ color: 'white' }} />} 
  onClick={handleBack}
  sx={{ 
    mb: 2,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'none',
    fontSize: '1rem',
    backgroundColor: 'rgb(150, 70, 110)', // Pink base color
   
    borderRadius: '20px',
    px: 3,
    py: 1,
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    '&:hover': {
     
      boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
      transform: 'translateY(-2px)'
    },
    '&:active': {
      transform: 'translateY(0)'
    },
    transition: 'all 0.3s ease'
  }}
>
  Home
</Button>
        
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            color: 'rgb(255, 215, 0)', // Gold color for main title
            fontWeight: 'bold',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
          }}
        >
          Top 50 Anime
        </Typography>
        
        <List sx={{ 
          bgcolor: 'rgba(30, 30, 30, 0.8)', // Slightly lighter dark background
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          {topAnime.map((anime, index) => (
            <React.Fragment key={anime.id}>
              <ListItem alignItems="flex-start" sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                }
              }}>
                <ListItemAvatar>
                  <Avatar 
                    variant="square" 
                    src={anime.coverImage.large} 
                    sx={{ 
                      width: 80, 
                      height: 120, 
                      mr: 2,
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
                    }} 
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography 
                      variant="h6"
                      sx={{
                        color: 'rgb(75, 235, 227)', // Light gray for titles
                        fontWeight: '500',
                        mb: 0.5
                      }}
                    >
                      {index + 1}. {anime.title.romaji || anime.title.english}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography 
                        component="span" 
                        display="block"
                        sx={{
                          color: anime.averageScore >= 80 
                            ? 'rgb(15, 196, 15)' // Green for high scores
                            : anime.averageScore >= 60
                            ? 'rgb(255, 255, 100)' // Yellow for medium scores
                            : 'rgb(255, 100, 100)', // Red for low scores
                          fontWeight: 'bold'
                        }}
                      >
                        Score: {anime.averageScore ? (anime.averageScore/10).toFixed(1) : "N/A"}
                      </Typography>
                      <Typography 
                        component="span" 
                        display="block"
                        sx={{
                          color: 'rgb(207, 205, 205)', // Lighter gray for details
                          fontSize: '0.9rem'
                        }}
                      >
                        Episodes: {anime.episodes || "N/A"} | {anime.season} {anime.startDate?.year}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {anime.genres?.slice(0, 3).map(genre => (
                          <Chip 
                            key={genre} 
                            label={genre} 
                            size="small" 
                            sx={{ 
                              mr: 1, 
                              mb: 1,
                              backgroundColor: 'rgb(78, 70, 70)',
                              color: 'rgb(220, 220, 220)',
                              '&:hover': {
                                backgroundColor: 'rgb(70, 70, 70)'
                              }
                            }} 
                          />
                        ))}
                      </Box>
                    </>
                  }
                />
              </ListItem>
              <Divider 
                variant="inset" 
                component="li" 
                sx={{ 
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  mx: 0
                }} 
              />
            </React.Fragment>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default TopAnime;