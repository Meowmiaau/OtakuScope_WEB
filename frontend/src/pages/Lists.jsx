import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
const backendPath = "http://localhost:5000";
dayjs.extend(relativeTime);

const Lists = () => {
  const [userLists, setUserLists] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserLists();
  }, []);

  const fetchUserLists = async () => {
    try {
      const res = await axios.get(`${backendPath}/api/lists`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserLists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateList = async () => {
    try {
      if (!newListName.trim()) return; // Don't allow empty names
      await axios.post(
        `${backendPath}/api/lists`,
        { name: newListName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewListName("");
      setShowModal(false);
      fetchUserLists(); // refresh lists
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewList = (listId, listName) => {
    navigate(`/lists/${listId}`, { state: { listName } });
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "24px",
          backgroundColor: "#272727",
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
            Your Created Lists
          </h2>
          <button
            onClick={() => setShowModal(true)}
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
            + Create New List
          </button>
        </div>

        {/* Lists */}
        {userLists.length > 0 ? (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            {userLists.map((list) => (
              <div
                key={list.id}
                style={{
                  padding: "20px",
                  border: "1px solid white",
                  borderRadius: "8px",
                  backgroundColor: "black",
                }}
              >
                {/* List Title and Updated At */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <h3
                    onClick={() => handleViewList(list.id, list.name)}
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      cursor: "pointer",
                      color: "white",
                      margin: 0,
                    }}
                  >
                    {list.name}
                  </h3>
                  {list.updatedAt && (
                    <span
                      style={{
                        fontSize: "14px",
                        color: "#9ca3af",
                        whiteSpace: "nowrap",
                      }}
                    >
                      Last updated {dayjs(list.updatedAt).fromNow()}
                    </span>
                  )}
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
                    const animeId = list.animeIds[index];
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
                          <Link
                            to={`/anime/${animeId}`}
                            style={{ width: "100%", height: "100%" }}
                          >
                            <img
                              src={`https://img.anili.st/media/${animeId}`}
                              alt={`Anime ${animeId}`}
                              style={{
                                objectFit: "contain",
                                width: "100%",
                                height: "100%",
                                transition: "transform 0.3s ease",
                              }}
                              onMouseOver={(e) =>
                                (e.target.style.transform = "scale(1.1)")
                              }
                              onMouseOut={(e) =>
                                (e.target.style.transform = "scale(1)")
                              }
                            />
                          </Link>
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
              You haven't created any lists yet!
            </p>
          </div>
        )}

        {/* Modal for creating list */}
        {showModal && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
            }}
          >
            <div
              style={{
                backgroundColor: "#1f2937",
                padding: "30px",
                borderRadius: "12px",
                width: "90%",
                maxWidth: "400px",
                boxShadow: "0 0 20px rgba(255,255,255,0.2)",
              }}
            >
              <h2
                style={{
                  marginBottom: "20px",
                  color: "white",
                  fontSize: "22px",
                }}
              >
                Create New List
              </h2>
              <input
                type="text"
                placeholder="Enter list name"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid white",
                  marginBottom: "20px",
                  backgroundColor: "#111",
                  color: "white",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#6b7280",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateList}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#2563eb",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Lists;