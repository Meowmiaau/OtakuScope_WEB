import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const backendPath = "http://localhost:5000";

const AllLists = () => {
  const [lists, setLists] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const listsPerPage = 10;

  useEffect(() => {
    fetchAllLists();
  }, [page]);

  const fetchAllLists = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${backendPath}/api/lists/all?page=${page}&limit=${listsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response data:", res.data);
      if (page === 1) {
        setLists(res.data.lists || res.data);
      } else {
        setLists((prev) => [...prev, ...(res.data.lists || res.data)]);
      }

      const totalLists = res.data.total || res.data?.length || 0;
      console.log;
      setHasMore(totalLists > page * listsPerPage);
    } catch (err) {
      console.error("Error fetching lists:", err);
    }
  };

  const loadMore = () => {
    setPage((prevPage) => prevPage + 1);
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
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <h2 style={{ fontSize: "24px", fontWeight: "bold" }}>
            All User Lists
          </h2>
        </div>

        {/* Lists */}
        {lists.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            {lists.map((list) => (
              <div
                key={list.id}
                style={{
                  padding: "20px",
                  border: "1px solid white",
                  borderRadius: "8px",
                  backgroundColor: "black",
                }}
              >
                {/* List Title */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "600",
                        cursor: "pointer",
                        color: "white",
                      }}
                    >
                      <Link
                        to={{pathname: `/public-list/${list.id}`,listName: list.name}}
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        {list.name}
                      </Link>
                    </h3>
                    <p style={{ fontSize: "14px", color: "#9ca3af" }}>
                      Created by: {list.username}
                    </p>
                  </div>
                </div>

                {/* Anime Grid (Max 5) */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "24px",
                  }}
                >
                  {Array.from({ length: 5 }).map((_, index) => {
                    const animeId = list.animeIds?.[index];
                    return (
                      <div
                        key={index}
                        style={{
                          width: "100%",
                          aspectRatio: "1/1",
                          backgroundColor: "#111",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                          border: "1px solid white",
                          overflow: "hidden",
                        }}
                      >
                        {animeId ? (
                          <AnimeBox animeId={animeId} />
                        ) : (
                          <div style={{ color: "#9ca3af" }}>Empty</div>
                        )}
                      </div>
                    );
                  })}
                </div>
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
            }}
          >
            <p style={{ color: "#d1d5db", fontSize: "18px" }}>
              No lists available
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "40px",
            }}
          >
            <button
              onClick={loadMore}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4f46e5",
                color: "white",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#4338ca")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#4f46e5")
              }
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

// ------------------------
// Helper: AnimeBox component
// ------------------------

const AnimeBox = ({ animeId }) => {
  const [anime, setAnime] = useState(null);

  useEffect(() => {
    const loadAnime = async () => {
      const fetchedAnime = await fetchAnimeInfo(animeId);
      setAnime(fetchedAnime);
    };
    loadAnime();
  }, [animeId]);

  if (!anime) return <div style={{ color: "#9ca3af" }}>Loading...</div>;

  return (
    <Link to={`/anime/${animeId}`} style={{ width: "100%", height: "100%" }}>
      <img
        src={anime.coverImage.large}
        alt={anime.title.romaji}
        style={{
          objectFit: "contain",
          width: "100%",
          height: "100%",
          transition: "transform 0.3s ease",
        }}
        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
      />
    </Link>
  );
};

// ------------------------
// Helper: Fetch Anime Info
// ------------------------

const fetchAnimeInfo = async (id) => {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        coverImage {
          large
        }
        title {
          romaji
        }
      }
    }
  `;

  const variables = { id };

  try {
    const res = await axios.post(
      "https://graphql.anilist.co",
      {
        query,
        variables,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.data.Media;
  } catch (err) {
    console.error("Error fetching anime info from Anilist:", err);
    return null;
  }
};

export default AllLists;
