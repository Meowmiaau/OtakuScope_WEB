import { CheckCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const backendPath = "http://localhost:5000";

export default function AddToListModal({ open, onClose, animeId, onSuccess }) {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchLists();
    }
  }, [open]);

  const fetchLists = async () => {
    try {
      setLoading(true);
      // use the endpoint that returns animeCount and animeIds per list
      const response = await axios.get(`${backendPath}/api/lists`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("🚀 API /lists response:", response.data);
      setLists(response.data);
    } catch (err) {
      console.error("Failed to fetch lists", err);
      setError("Failed to fetch lists");
    } finally {
      setLoading(false);
    }
  };

  const createNewList = async () => {
    if (!newListName.trim()) return;
    try {
      await axios.post(
        `${backendPath}/api/lists`,
        { name: newListName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewListName("");
      fetchLists();
    } catch (err) {
      console.error("Failed to create list", err);
      setError("Failed to create list");
    }
  };

  const addToList = async (listId) => {
    try {
      await axios.post(
        `${backendPath}/api/lists/${listId}/anime`,
        { animeId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to add anime to list", err);
      setError("Failed to add anime to list");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#222", // dark background
          borderRadius: 2,
          p: 4,
          minWidth: 350,
          color: "white",
        }}
      >
        <Typography variant="h5" mb={2} color="white">
          Add to List
        </Typography>

        {/* New List Creation */}
        <Box mb={3}>
          <TextField
            label="New List Name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            fullWidth
            InputLabelProps={{ style: { color: "white" } }}
            InputProps={{ style: { color: "white" } }}
          />
          <Button
            onClick={createNewList}
            variant="contained"
            color="primary"
            sx={{ mt: 1 }}
            fullWidth
          >
            Create New List
          </Button>
        </Box>

        {/* Loading / Error / Lists */}
        {loading ? (
          <Box textAlign="center">
            <CircularProgress />
            <Typography mt={1}>Loading...</Typography>
          </Box>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : lists.length === 0 ? (
          <Typography>No lists yet. Create one!</Typography>
        ) : (
          lists.map((list) => {
            const animeAlreadyInList = list.animeIds?.includes(Number(animeId));

            console.log(
              `List "${list.name}"`,
              list.animeIds,
              "Checking for animeId:",
              animeId
            );

            return (
              <Box
                key={`list-${list.id}`}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
                sx={{ backgroundColor: "#333", padding: 1.5, borderRadius: 1 }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  {animeAlreadyInList && <CheckCircle fontSize="small" />}
                  <Typography sx={{ fontWeight: "bold", color: "white" }}>
                    {list.name}
                  </Typography>
                  <Typography sx={{ fontSize: "0.85rem", color: "#ccc" }}>
                    ({list.animeCount} anime)
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => addToList(list.id)}
                  disabled={animeAlreadyInList}
                  sx={{
                    color: animeAlreadyInList ? "gray" : "white",
                    borderColor: animeAlreadyInList ? "gray" : "white",
                  }}
                >
                  {animeAlreadyInList ? "Added" : "Add"}
                </Button>
              </Box>
            );
          })
        )}
      </Box>
    </Modal>
  );
}
