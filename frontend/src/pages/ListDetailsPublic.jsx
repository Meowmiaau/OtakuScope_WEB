import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
const backendPath = "http://localhost:5000";

const ListDetailsPublic = () => {
  const { listId } = useParams();
  const location = useLocation();
  const [animeIds, setAnimeIds] = useState([]);
  const [animeDetails, setAnimeDetails] = useState({});
  const token = localStorage.getItem("token");
  console.log("Location state:", location.state);
  const listName = location.state?.listName || "Unnamed List";
  useEffect(() => {
    fetchAnimeInList();
  }, []);

  const fetchAnimeInList = async () => {
    try {
      const res = await axios.get(`${backendPath}/api/lists/${listId}/anime`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      
      setAnimeIds(res.data);

      // Fetch details for each anime
      fetchAnimeDetails(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnimeDetails = async (ids) => {
    const detailsObj = {};

    for (const id of ids) {
      try {
        const query = `
          query ($id: Int) {
            Media(id: $id, type: ANIME) {
              id
              title {
                romaji
                english
                native
              }
            }
          }
        `;

        const response = await axios.post(
          "https://graphql.anilist.co",
          {
            query,
            variables: { id: parseInt(id) },
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        if (response.data.data?.Media) {
          detailsObj[id] = response.data.data.Media;
        }
      } catch (err) {
        console.error(`Error fetching details for anime ${id}:`, err);
      }
    }

    setAnimeDetails(detailsObj);
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          padding: "24px",
          backgroundColor: "black",
          color: "white",
          minHeight: "100vh",
        }}
      >
        <h2
          style={{
            fontSize: "30px",
            fontWeight: "bold",
            marginBottom: "24px",
            color: "white",
          }}
        >
          {listName}
        </h2>

        {animeIds.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "24px",
            }}
          >
            {animeIds.map((animeId, index) => (
              <div key={index} style={{ position: "relative" }}>
                <Link
                  to={`/anime/${animeId}`}
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "8px",
                        overflow: "hidden",
                        border: "1px solid white",
                        boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)",
                        transition: "box-shadow 0.3s ease",
                        width: "100%",
                        aspectRatio: "1/1.2",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 10px 15px rgba(255, 255, 255, 0.2)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.boxShadow =
                          "0 4px 6px rgba(255, 255, 255, 0.1)")
                      }
                    >
                      <img
                        src={`https://img.anili.st/media/${animeId}`}
                        alt={`Anime ${animeId}`}
                        style={{
                          objectFit: "contain",
                          maxWidth: "100%",
                          maxHeight: "100%",
                          transition: "transform 0.3s ease",
                        }}
                        onMouseOver={(e) =>
                          (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) =>
                          (e.target.style.transform = "scale(1)")
                        }
                      />
                    </div>
                    <div
                      style={{
                        marginTop: "12px",
                        textAlign: "center",
                        width: "100%",
                        padding: "0 8px",
                      }}
                    >
                      <p
                        style={{
                          color: "white",
                          fontSize: "14px",
                          fontWeight: "500",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {animeDetails[animeId]?.title?.english ||
                          animeDetails[animeId]?.title?.romaji ||
                          `Anime ${animeId}`}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "160px",
              border: "1px solid white",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            <p style={{ color: "#d1d5db", fontSize: "18px" }}>
              No anime found in this list.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ListDetailsPublic;
