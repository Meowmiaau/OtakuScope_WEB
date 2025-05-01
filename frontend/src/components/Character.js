import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import "./../styles/Character.css";

const backendPath = "http://localhost:5000";

const Character = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const animeMetadata = await axios.post("https://graphql.anilist.co", {
          query: `
            query ($id: Int) {
              Media(id: $id, type: ANIME) {
                title { romaji english native }
                description
                episodes
                duration
                status
                startDate { year month day }
                season
                averageScore
                meanScore
                popularity
                favourites
                studios { nodes { name } }
                coverImage { large }
                bannerImage
                tags { id name rank }
                relations {
                  edges {
                    node {
                      id
                      title { romaji }
                      type
                      format
                      coverImage { large }
                    }
                    relationType
                  }
                }
                characters {
                  edges {
                    node {
                      id
                      name { full }
                      image { large }
                    }
                    role
                    voiceActors {
                      id
                      name { full }
                      image { large }
                      language
                    }
                  }
                }
                staff {
                  edges {
                    node { 
                      id
                      name { full }
                      image { large }
                    }
                    role
                  }
                }
              }
            }
          `,
          variables: { id: parseInt(id, 10) },
        });

        setAnime(animeMetadata.data.data.Media);
        setCharacters(animeMetadata.data.data.Media.characters.edges);
      } catch (error) {
        console.error("Error fetching characters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  if (loading) return <CircularProgress />;

  return (
    <Box className="anime-container">
      {anime ? (
        <>
          {/* Banner */}
          <div className="banner">
            {anime.bannerImage ? (
             <div className="banner-fade">
             <img
               src={anime.bannerImage}
               alt="Banner"
               className="banner-img"
             />
           </div>
            ) : (
              <div className="no-banner">No Banner</div>
            )}
          </div>

          {/* Cover Image and Title */}
          <div className="anime-content" style={{ marginTop: "5px" }}>
            <div className="anime-cover">
              {anime.coverImage?.large ? (
                <img src={anime.coverImage.large} alt={anime.title.romaji} />
              ) : (
                <div className="no-cover">No Cover</div>
              )}
            </div>

            <div className="anime-info">
              <Typography variant="h3" className="Title">{anime.title.romaji}</Typography>
              <Typography variant="body1" className="anime-description">
                {anime.description
                  ?.replace(/<[^>]*>/g, "")
                  .replace(/\n/g, "\n") || "No description available."}
              </Typography>
              <Typography variant="subtitle1" className="anime-description">
                <strong className="episodes">Episodes:</strong>{" "}
                {anime.episodes || "N/A"}
              </Typography>
            </div>
          </div>

          {/* Navigation Bar */}
          <div className="anime-navigation">
            <Link to={`/anime/${id}`}>Overview</Link>
            <Link to={`/anime/${id}/character`}>Characters</Link>
            <Link to={`/anime/${id}/staff`}>Staff</Link>
            <Link to={`/anime/${id}/status`}>Status</Link>
            <Link to={`/home`}>Home</Link>
          </div>

          {/* Characters Section */}
          
          
      <div className="characters-grid">
        {characters.map((character) => (
          <div key={character.node.id} className="character-card">
            <img
              src={character.node.image.large}
              alt={character.node.name.full}
              className="character-image"
            />
            <div className="character-info">
              <Typography variant="h5" className="character-name">{character.node.name.full}</Typography>
              <Typography variant="body1" className="character-role">
                {character.role === 'MAIN' ? 'Main' : 'Supporting'}
              </Typography>
              {character.voiceActors.length > 0 && (
                <div className="voice-actors">
                  <Typography variant="subtitle1" className="voice-actors">Voice Actors:</Typography>
                  {character.voiceActors.map((actor) => (
                    <div key={actor.id} className="voice-actor">
                      <img
                        src={actor.image.large}
                        alt={actor.name.full}
                        className="voice-actor-image"
                      />
                      <Typography variant="body2" className="language">
                        {actor.name.full} ({actor.language})
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
        </>
      ) : (
        <Typography variant="h5">No Anime Data Available</Typography>
      )}
    </Box>
  );
};

export default Character;
