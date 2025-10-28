import { Box, Button, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Welcome to your Dashboard 🎨</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/editor")}>
        ➕ Create New Design
      </Button>

      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6">My Designs</Typography>
        <Typography variant="body2">You can view your saved designs here soon.</Typography>
      </Paper>
    </Box>
  );
}
