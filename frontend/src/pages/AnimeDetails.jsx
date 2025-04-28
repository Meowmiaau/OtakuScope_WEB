//frontend/src/pages/AnimeDetails.js
import React, { useEffect, useState } from "react";
import { useParams ,Link} from "react-router-dom";
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
import ReviewSection from "../components/ReviewSection";
import AddToListModal from "../components/AddToListModal";
import Navbar from "../components/Navbar";

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
  const [openAddModal, setOpenAddModal] = useState(false);
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
                    tags {
                          id
                          name
                          rank
                        }
                    relations {
                        edges {
                          node {
                              id
                             title { romaji }
                             type
                             format
                             coverImage { large }
                                 }
                     relationType }}
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
                            image{large}
                            language
                                  }}}
                   staff {
                         edges {
                         node {
                            id
                            name { full }
                            image { large }
                              }
                         role
                         }}
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

  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <CircularProgress />;

  return (
    <>
    <Navbar />
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
                <Button onClick={() => setOpenAddModal(true)}>
                  Add to Lists..
                </Button>
                <AddToListModal
                  open={openAddModal}
                  onClose={() => setOpenAddModal(false)}
                  animeId={id} // pass the anime id
                  onSuccess={() => {
                    // optional callback when anime successfully added
                    setSnackbar({
                      open: true,
                      message: "Anime added to list!",
                      severity: "success",
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </>
      ) : (
        <Typography variant="h5">No Anime Data Available</Typography>
      )}
      {/* Navigation Bar */}
      <div className="anime-navigation">
      <Link to={`/anime/${id}`}>Overview</Link>
            <Link to={`/anime/${id}/character`}>Characters</Link>
            <Link to={`/anime/${id}/staff`}>Staff</Link>
            <Link to={`/anime/${id}/status`}>Status</Link>
            <Link to={`/home`}>Home</Link>
      </div>

      {/* Parent Container */}
      <div className="parent-container">
        {/* Details Container */}
        <div className="details-container">
          {/* Details Section */}
          <div className="details-section">
            <div className="details-grid">
              <div>
                <h5>Details</h5>
                <p>
                  <strong>Format:</strong> TV
                </p>
                <p>
                  <strong>Episodes:</strong> {anime.episodes || "N/A"}
                </p>
                <p>
                  <strong>Episode Duration:</strong> {anime.duration || "N/A"}{" "}
                  mins
                </p>
                <p>
                  <strong>Status:</strong> {anime.status || "N/A"}
                </p>
                <p>
                  <strong>Start Date:</strong> {anime.startDate?.year || "N/A"}-
                  {anime.startDate?.month || "N/A"}-
                  {anime.startDate?.day || "N/A"}
                </p>
                <p>
                  <strong>Season:</strong> {anime.season || "N/A"}{" "}
                  {anime.startDate?.year || ""}
                </p>
                <p>
                  <strong>Average Score:</strong> {anime.averageScore || "N/A"}%
                </p>
                <p>
                  <strong>Mean Score:</strong> {anime.meanScore || "N/A"}%
                </p>
                <p>
                  <strong>Popularity:</strong> {anime.popularity || "N/A"}
                </p>
                <p>
                  <strong>Favorites:</strong> {anime.favourites || "N/A"}
                </p>
                <p>
                  <strong>Studios:</strong>{" "}
                  {anime.studios?.nodes
                    ?.map((studio) => studio.name)
                    .join(", ") || "N/A"}
                </p>
              </div>
            </div>
            <h5 className="tags-section h5">Tags</h5>
                        {/* Tags Section */}
                        <div className="tags-grid">
                         {anime.tags?.slice(0, 19).map((tag) => (
                         <div key={tag.id} className="tag-item">
                          <span className="tag-name">{tag.name}</span>
                            <span className="tag-percentage">{tag.rank}%</span>
                       </div>
                        ))}
                        </div>
          </div>
        </div>
        <div className="relations-container">
          {/* Relations Section */}
          <div className="relations-section">
            <h3 className="relation-header">Relations</h3>
            <div className="relations-row">
              {anime.relations?.edges?.map((relation) => (
                <div key={relation.node.id} className="relation-item">
                  {relation.node.coverImage?.large ? (
                    <img
                      src={relation.node.coverImage.large}
                      alt={relation.node.title.romaji}
                      className="relation-image"
                    />
                  ) : (
                    <div className="no-image">No Image Available</div>
                  )}
                  <div className="relation-info">
                    <p>
                      <strong>{relation.relationType}:</strong>
                    </p>
                    <p>
                      {relation.node.title.romaji} ({relation.node.format})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Characters Section */}

            <h3 className="relation-header">Characters</h3>
            <div className="characters-grid">
              {Object.entries(
                anime.characters?.edges?.reduce((acc, character) => {
                  const characterName = character.node.name.full;
                  if (!acc[characterName]) {
                    acc[characterName] = {
                      role: character.role,
                      image: character.node.image.large,
                      voiceActors: [],
                    };
                  }
                  character.voiceActors?.forEach((voiceActor) => {
                    acc[characterName].voiceActors.push(
                      `${voiceActor.name.full} (${voiceActor.language})`
                    );
                  });
                  return acc;
                }, {})
              )
                .slice(0, 7) // Limit to top 6 characters
                .map(([characterName, data]) => (
                  <div key={characterName} className="character-item" style={{backgroundColor: "#585454", marginLeft:"-17px", borderRadius:"5px", width:"180px",height:"250px", marginRight:"-25px", padding:"5px"}}>
                    <div className="character-image-container">
                      <img
                        src={data.image}
                        alt={characterName}
                        className="character-image"
                      />

                    </div>
                    <div>
                    <p className="character-name">{characterName}</p>
                    <p className="character-role">{data.role}</p>
                    </div>

                    {/* Character Info */}

                  </div>
                ))}
            </div>

            {/* Staff Section */}

            <h3 className="staff-header">Staff</h3>
            <div className="staff-grid">
              {anime.staff?.edges?.slice(0, 6).map((staff) => (
                <div key={staff.node.id} className="staff-item">
                  {/* Staff Image */}
                  <div className="staff-image-container">
                    {staff.node.image?.large ? (
                      <img
                        src={staff.node.image.large}
                        alt={staff.node.name.full}
                        className="staff-image"
                      />
                    ) : (
                      <div className="no-image">No Image Available</div>
                    )}
                  </div>

                  {/* Staff Info */}
                  <div className="staff-info">
                    <p className="staff-name">{staff.node.name.full}</p>
                    <p className="staff-role">{staff.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="reviews-section-wrapper">
        <ReviewSection animeId={id} />
      </div>
      <div className="footer">
        <p>© 2023 Anime Reviews. All rights reserved.</p>
      </div>
    </Box>
    </>
  );
};

export default AnimeDetails;
