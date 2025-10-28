import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
          Matty 🎨
        </Typography>
        <Button color="inherit" onClick={() => navigate("/")}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
