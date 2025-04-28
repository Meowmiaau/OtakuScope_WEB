import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Box, Typography, CircularProgress } from "@mui/material";
import "./../styles/Staff.css";

const Staff = () => {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [staff, setStaff] = useState([]);
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
        setStaff(animeMetadata.data.data.Media.staff?.edges || []);
      } catch (error) {
        console.error("Error fetching staff:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id]);

  // Group staff by their roles
  const groupedStaff = staff.reduce((acc, staffMember) => {
    const role = staffMember.role || "Other";
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(staffMember);
    return acc;
  }, {});

  // Find the original creator
  const originalCreator = staff.find(
    (member) => member?.role === "Original Creator"
  );

  if (loading) return <CircularProgress />;

  return (
    <Box className="anime-container">
      {anime ? (
        <>
          {/* Banner */}
          <div className="banner">
            {anime.bannerImage ? (
              <img src={anime.bannerImage} alt="Banner" className="banner-img" />
            ) : (
              <div className="no-banner">No Banner</div>
            )}
          </div>

          {/* Cover Image and Title */}
          <div className="anime-content">
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

          {/* Staff Section */}
          <div className="staff-members">
  {staff.map((member) => (
    <div key={member.node?.id} className="staff-member">
      {member.node?.image?.large && (
        <img
          src={member.node.image.large}
          alt={member.node.name.full}
          className="staff-image"
        />
      )}
      <Typography variant="body1" className="staff-name">
        {member.node?.name?.full || "Unknown"}
      </Typography>
      <Typography variant="body2" className="staff-role">
        {member.role || "Unknown Role"}
      </Typography>
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

export default Staff;