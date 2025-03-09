import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import "./../styles/AnimeDetails.css";

const backendPath = "http://localhost:5000";

const StatusButton = ({
  watch_status,
  setWatchStatus,
  id,
  isFavorite,
  score,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleStatusChange = async (newStatus, id) => {
    setWatchStatus(newStatus);
    handleClose();

    try {
      // Send the update immediately to the backend
      await axios.post(
        `${backendPath}/api/anime/${id}`,
        {
          status: newStatus,
          is_favorite: isFavorite, // Use the passed prop
          score,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Status updated:", newStatus);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <>
      <Button onClick={handleClick} className="status-button">
        {watch_status}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {["Plan to Watch", "Watching", "Watched"].map((s) => (
          <MenuItem key={s} onClick={() => handleStatusChange(s, id)}>
            {s}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const ScoreDropdown = ({ score, setScore, watch_status, isFavorite, id }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleScoreChange = async (newScore) => {
    setScore(newScore);
    handleClose();

    try {
      // Send the update immediately to the backend
      await axios.post(
        `${backendPath}/api/anime/${id}`,
        {
          status: watch_status,
          is_favorite: isFavorite,
          score: newScore,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Score updated:", newScore);
    } catch (err) {
      console.error("Error updating score:", err);
    }
  };

  return (
    <>
      <Button onClick={handleClick} className="score-button">
        {score || "Rate"}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {[...Array(10)].map((_, i) => (
          <MenuItem key={i + 1} onClick={() => handleScoreChange(i + 1)}>
            {i + 1}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      return decoded.id;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }
  return null;
};

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [watch_status, setWatchStatus] = useState("Not Set");
  const [isFavorite, setIsFavorite] = useState(false);
  const [score, setScore] = useState(null);

  // Move handleFavoriteToggle inside the component
  const handleFavoriteToggle = async () => {
    try {
      const updatedFavoriteStatus = !isFavorite;
      setIsFavorite(updatedFavoriteStatus);

      // Send the update to the backend immediately
      await axios.post(
        `${backendPath}/api/anime/${id}`,
        {
          status: watch_status, // Keep the current status
          is_favorite: updatedFavoriteStatus, // Update the favorite status
          score,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Favorite updated:", updatedFavoriteStatus);
    } catch (err) {
      console.error("Error updating favorite:", err);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        try {
          console.log("User ID:", getUserIdFromToken());
          console.log("Anime ID:", id);
          const userAnimeData = await axios.get(
            `${backendPath}/api/anime/${id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (userAnimeData.data) {
            console.log("User anime data:", userAnimeData.data);
            setWatchStatus(userAnimeData.data.status || "Not Set");
            setIsFavorite(
              userAnimeData.data.is_favorite === true ||
                userAnimeData.data.is_favorite === 1
            );
            setScore(userAnimeData.data.score || null);
          }
        } catch (userDataError) {
          console.error("Error fetching user anime data:", userDataError);
          // Continue with default values even if user data fetch fails
          setWatchStatus("Not Set");
          setIsFavorite(false);
          setScore(null);
        }

        // Then try to get anime metadata
        const animeMetadata = await axios.post("https://graphql.anilist.co", {
          query: `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    title { romaji english native }
                    description
                    episodes
                    startDate { year month day }
                    coverImage { large }
                    bannerImage
                }
            }
          `,
          variables: { id: parseInt(id, 10) },
        });

        console.log("watch_status:", watch_status);
        console.log("is_favorite:", isFavorite);
        console.log("score:", score);
        setAnime(animeMetadata.data.data.Media);
      } catch (error) {
        console.error("Error fetching data:", error);
        setSnackbar({
          open: true,
          message: "Failed to load anime details.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      console.log("Sending update with:", {
        watch_status,
        is_favorite: isFavorite,
        score,
      });

      const response = await axios.post(
        `${backendPath}/api/anime/${id}`,
        {
          status: watch_status,
          is_favorite: isFavorite,
          score,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("Update response:", response.data);
      setSnackbar({
        open: true,
        message: "Updated successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({ open: true, message: "Update failed!", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <CircularProgress />;

  return (
    <Box className="anime-container">
      {anime ? (
        <>
          <div className="banner">
            {anime.bannerImage ? (
              <img
                src={anime.bannerImage}
                alt="Banner"
                className="banner-img"
              />
            ) : (
              <div className="no-banner">No Banner</div>
            )}
          </div>

          <div className="anime-content">
            <div className="anime-cover">
              {anime.coverImage?.large ? (
                <img src={anime.coverImage.large} alt={anime.title.romaji} />
              ) : (
                <div className="no-cover">No Cover</div>
              )}
            </div>

            <div className="anime-info">
              <Typography variant="h3">{anime.title.romaji}</Typography>
              <Typography variant="body1" className="anime-description">
                {anime.description
                  ?.replace(/<[^>]*>/g, "")
                  .replace(/\n/g, "\n") || "No description available."}
              </Typography>
              <Typography variant="subtitle1">
                <strong style={{ color: "#32a9d1" }}>Episodes:</strong>{" "}
                {anime.episodes || "N/A"}
              </Typography>

              <div className="buttons">
                <StatusButton
                  watch_status={watch_status}
                  setWatchStatus={setWatchStatus}
                  id={id}
                  isFavorite={isFavorite}
                  score={score}
                />

                <ScoreDropdown 
                  score={score} 
                  setScore={setScore}
                  watch_status={watch_status}
                  isFavorite={isFavorite}
                  id={id}
                />

                <Button onClick={handleFavoriteToggle}>
                  {isFavorite ? (
                    <FavoriteIcon style={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon />
                  )}
                </Button>
              </div>
            </div>
          </div>
          
          <Snackbar 
            open={snackbar.open} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity={snackbar.severity}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      ) : (
        <Typography variant="h5">No Anime Data Available</Typography>
      )}
    </Box>
  );
};

export default AnimeDetails;