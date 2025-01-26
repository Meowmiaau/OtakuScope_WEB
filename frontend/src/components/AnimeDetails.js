import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";

const AnimeDetails = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [status, setStatus] = useState("Plan to Watch"); // Default status

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await axios.post("https://graphql.anilist.co", {
          query: `
                    query ($id: Int) {
                        Media(id: $id, type: ANIME) {
                            title {
                                romaji
                                english
                                native
                            }
                            description
                            episodes
                            releaseDate: startDate {
                                year
                                month
                                day
                            }
                            coverImage {
                                large
                            }
                        }
                    }
                    `,
          variables: { id: parseInt(id, 10) },
        });

        setAnime(response.data.data.Media);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeDetails();
  }, [id]);
  useEffect(() => {
    const fetchUserAnimeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/anime/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const { status, is_favorite } = response.data;
        setStatus(status || "Plan to Watch");
        setAnime((prev) => ({ ...prev, is_favorite })); // Update anime with is_favorite
      } catch (error) {
        console.error("Error fetching user anime details:", error);
      }
    };

    fetchUserAnimeDetails();
  }, [id]);

  const handleAction = async (action) => {
    if (action === "favorite" && anime?.is_favorite) {
      setSnackbar({
        open: true,
        message: "Anime is already marked as favorite!",
        severity: "info",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const data = {
        status: action === "completed" ? "Watched" : "Plan to Watch",
        is_favorite: action === "favorite",
      };

      await axios.post(`http://localhost:5000/api/anime/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (action === "favorite") {
        setAnime((prev) => ({ ...prev, is_favorite: true }));
      }

      setSnackbar({
        open: true,
        message: `Anime ${action} successfully!`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update anime status.",
        severity: "error",
      });
    }
  };

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    try {
      const token = localStorage.getItem("token");
      const data = { anime_id: id, status: newStatus };

      await axios.post("http://localhost:5000/api/anime/:id", data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        message: `Status updated to '${newStatus}' successfully!`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating status:", error.message);
      setSnackbar({
        open: true,
        message: "Failed to update anime status.",
        severity: "error",
      });
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ padding: 3 }}>
      {anime && (
        <>
          <img
            src={anime.coverImage.large}
            alt={anime.title.romaji}
            style={{ maxWidth: "100%" }}
          />
          <Typography variant="h4" gutterBottom>
            {anime.title.romaji}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {anime.description}
          </Typography>
          <Typography variant="subtitle1">
            Episodes: {anime.episodes || "N/A"}
          </Typography>
          <Typography variant="subtitle1">
            Release Date:{" "}
            {`${anime.releaseDate.year}-${anime.releaseDate.month}-${anime.releaseDate.day}`}
          </Typography>
          <Box sx={{ marginTop: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={handleStatusChange}
                label="Status"
              >
                <MenuItem value="Plan to Watch">Plan to Watch</MenuItem>
                <MenuItem value="Watching">Watching</MenuItem>
                <MenuItem value="Watched">Watched</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color={anime?.is_favorite ? "error" : "secondary"}
              onClick={() => handleAction("favorite")}
            >
              {anime?.is_favorite ? "Unmark Favorite" : "Mark as Favorite"}
            </Button>
          </Box>
        </>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AnimeDetails;
