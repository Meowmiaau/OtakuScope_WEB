import React, { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
const backendPath = "http://localhost:5000"; 

const ListDetails = () => {
  const { listId } = useParams();
  const location = useLocation();
  const { listName } = location.state || {};
  const [animeIds, setAnimeIds] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAnimeInList();
  }, []);

  const fetchAnimeInList = async () => {
    try {
      const res = await axios.get(`${backendPath}/api/lists/${listId}/anime`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnimeIds(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnime = async (animeId) => {
    try {
      await axios.delete(`${backendPath}/api/lists/${listId}/anime/${animeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // After delete, update UI immediately
      setAnimeIds(prev => prev.filter(id => id !== animeId));
    } catch (err) {
      console.error("Error deleting anime:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <Navbar />
    <div style={{ 
      padding: "24px", 
      backgroundColor: "black", 
      color: "white", 
      minHeight: "100vh" 
    }}>
      <h2 style={{ 
        fontSize: "30px", 
        fontWeight: "bold", 
        marginBottom: "24px",
        color: "white"
      }}>
        {listName}
      </h2>

      {animeIds.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(5, 1fr)", 
          gap: "24px" 
        }}>
          {animeIds.map((animeId, index) => (
            <div key={index} style={{ position: "relative" }}>
              <Link to={`/anime/${animeId}`}>
                <div style={{ 
                  borderRadius: "8px", 
                  overflow: "hidden", 
                  border: "1px solid white",
                  boxShadow: "0 4px 6px rgba(255, 255, 255, 0.1)",
                  transition: "box-shadow 0.3s ease",
                  width: "100%",
                  aspectRatio: "1/1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onMouseOver={(e) => e.currentTarget.style.boxShadow = "0 10px 15px rgba(255, 255, 255, 0.2)"}
                onMouseOut={(e) => e.currentTarget.style.boxShadow = "0 4px 6px rgba(255, 255, 255, 0.1)"}
                >
                  <img
                    src={`https://img.anili.st/media/${animeId}`}
                    alt={`Anime ${animeId}`}
                    style={{ 
                      objectFit: "contain", 
                      maxWidth: "100%", 
                      maxHeight: "100%",
                      transition: "transform 0.3s ease"
                    }}
                    onMouseOver={(e) => e.target.style.transform = "scale(1.05)"}
                    onMouseOut={(e) => e.target.style.transform = "scale(1)"}
                  />
                </div>
              </Link>

              {/* Delete Button */}
              <button
                onClick={() => handleDeleteAnime(animeId)}
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "6px",
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                  lineHeight: "30px",
                  textAlign: "center",
                }}
                title="Remove Anime"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          height: "160px", 
          border: "1px solid white", 
          borderRadius: "8px",
          marginTop: "20px"
        }}>
          <p style={{ color: "#d1d5db", fontSize: "18px" }}>No anime found in this list.</p>
        </div>
      )}
    </div>
    </>
  );
};

export default ListDetails;
