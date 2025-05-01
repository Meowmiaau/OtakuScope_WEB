import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);
import "./../styles/Status.css";

const Status = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    statusDistribution: [],
    scoreDistribution: [],
    rankings: []
  });


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
               stats {
                  statusDistribution {
                    status
                    amount
                  }
                  scoreDistribution {
                    score
                    amount
                  }
                }
                rankings {
                  rank
                  type
                  year
                  format
                }
              }
            }
          `,
          variables: { id: parseInt(id, 10) },
        });


        const mediaData = animeMetadata.data.data.Media;
        setAnime(mediaData);
        
        // Process stats data
        const processedStats = {
          statusDistribution: mediaData.stats?.statusDistribution || [],
          scoreDistribution: mediaData.stats?.scoreDistribution || [],
          rankings: mediaData.rankings || []
        };
        setStats(processedStats);

      } catch (error) {
        console.error("Error fetching anime stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Helper function to format numbers with commas
  const formatNumber = (num) => {
    return num ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0";
  };

  // Get status counts
  const getStatusCount = (status) => {
    const statusData = stats.statusDistribution.find(s => s.status === status);
    return formatNumber(statusData?.amount || 0);
  };
// Process score distribution data
const scoreDistributionData = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(score => {
    const scoreData = stats.scoreDistribution.find(s => s.score === score);
    return {
      score,
      amount: scoreData?.amount || 0,
      label: score.toString()
    };
  });

  // Calculate max amount for score distribution scaling
  const maxScoreAmount = Math.max(...scoreDistributionData.map(s => s.amount), 1);

  // Process rankings data
  const processedRankings = {
    rated: stats.rankings.filter(r => r.type === 'RATED'),
    popular: stats.rankings.filter(r => r.type === 'POPULAR')
  };

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
      <div className="anime-content" style={{ marginTop: "2px" }}>
        <div className="anime-cover">
          {anime.coverImage?.large ? (
            <img src={anime.coverImage.large} alt={anime.title.romaji} />
          ) : (
            <div className="no-cover">No Cover</div>
          )}
        </div>

        <div className="anime-info">
          <Typography variant="h3" className="Title">
            {anime.title.romaji}
          </Typography>
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

      {/* Status Content */}
      <Box className="status-container">
        <Box className="status-section">
          <Typography variant="h4" className="section-title">Status Distribution</Typography>
          <Box className="status-grid">
            <Box className="status-item-current">
              <Typography variant="h5" className="status-count">
                {getStatusCount('CURRENT')}
              </Typography>
              <Typography variant="subtitle1" className="status-label">Current</Typography>
            </Box>
            <Box className="status-item-planning">
              <Typography variant="h5" className="status-count">
                {getStatusCount('PLANNING')}
              </Typography>
              <Typography variant="subtitle1" className="status-label">Planning</Typography>
            </Box>
            <Box className="status-item-paused">
              <Typography variant="h5" className="status-count">
                {getStatusCount('PAUSED')}
              </Typography>
              <Typography variant="subtitle1" className="status-label">Paused</Typography>
            </Box>
            <Box className="status-item-dropped">
              <Typography variant="h5" className="status-count">
                {getStatusCount('DROPPED')}
              </Typography>
              <Typography variant="subtitle1" className="status-label">Dropped</Typography>
            </Box>
            <Box className="status-item-completed">
              <Typography variant="h5" className="status-count">
                {getStatusCount('COMPLETED')}
              </Typography>
              <Typography variant="subtitle1" className="status-label">Completed</Typography>
            </Box>
          </Box>
        </Box>

        <Box className="status-section">
          <Typography variant="h4" className="section-title">Score Distribution</Typography>
          <Box className="score-distribution">
            {scoreDistributionData.map(({ score, amount, label }) => (
              <Box key={score} className="score-bar-container">
                <Typography variant="caption" className="score-label">{label}</Typography>
                <Box className="score-bar-wrapper">
                  <Box 
                    className="score-bar" 
                    style={{ 
                      width: `${maxScoreAmount > 0 ? (amount / maxScoreAmount) * 100 : 0}%` 
                    }}
                  />
                </Box>
                <Typography variant="caption" className="score-count">
                  {formatNumber(amount)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box className="rankings-section">
          <Typography variant="h4" className="section-title">Rankings</Typography>
          <Box className="rankings-grid">
            {processedRankings.rated.map((ranking, index) => (
              <Box key={`rated-${index}`} className="ranking-item">
                <Typography variant="h5" className="ranking-position">#{ranking.rank}</Typography>
                <Typography variant="subtitle1" className="ranking-label">
                  Highest Rated {ranking.year ? ranking.year : 'All Time'}
                </Typography>
              </Box>
            ))}
            {processedRankings.popular.map((ranking, index) => (
              <Box key={`popular-${index}`} className="ranking-item">
                <Typography variant="h5" className="ranking-position">#{ranking.rank}</Typography>
                <Typography variant="subtitle1" className="ranking-label">
                  Most Popular {ranking.year ? ranking.year : 'All Time'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  ) : (
    <Typography variant="h5">No Anime Data Available</Typography>
  )}
</Box>
  );
};
export default Status;