import { useState } from "react";
import { useDispatch } from "react-redux";
import { register } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper
} from "@mui/material";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(register(formData));
    navigate("/");
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 10 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Register for Matty
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField fullWidth margin="normal" label="Username" name="username" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Password" type="password" name="password" onChange={handleChange} />
          <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Register</Button>
        </Box>
      </Paper>
    </Container>
  );
}
