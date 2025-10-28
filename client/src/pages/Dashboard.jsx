import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, Grid, Card, CardMedia, CardContent, CardActions, IconButton, CircularProgress } from "@mui/material";
import { Delete as DeleteIcon, Edit as EditIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const response = await API.get("/designs");
      setDesigns(response.data);
    } catch (error) {
      console.error("Error fetching designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this design?")) return;
    
    try {
      await API.delete(`/designs/${id}`);
      setDesigns(designs.filter(d => d._id !== id));
    } catch (error) {
      console.error("Error deleting design:", error);
      alert("Failed to delete design");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">My Designs 🎨</Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate("/editor")}
        >
          ➕ Create New Design
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
          <CircularProgress />
        </Box>
      ) : designs.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>No designs yet</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start creating your first design!
          </Typography>
          <Button variant="contained" onClick={() => navigate("/editor")}>
            Create Design
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {designs.map((design) => (
            <Grid item xs={12} sm={6} md={4} key={design._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={design.thumbnailUrl || "https://via.placeholder.com/300x200?text=No+Preview"}
                  alt={design.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {design.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Created: {new Date(design.createdAt).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton 
                    color="primary" 
                    onClick={() => navigate(`/editor?id=${design._id}`)}
                    title="Edit Design"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(design._id)}
                    title="Delete Design"
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}