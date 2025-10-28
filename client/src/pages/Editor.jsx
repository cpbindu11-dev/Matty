import { Box, Typography } from "@mui/material";

export default function Editor() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Design Editor (Fabric.js coming soon!)</Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        Here you’ll be able to add shapes, text, and images.
      </Typography>
    </Box>
  );
}
