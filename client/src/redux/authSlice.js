import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";

export const login = createAsyncThunk("auth/login", async (data) => {
  const res = await API.post("/auth/login", data);
  localStorage.setItem("token", res.data.token);
  return res.data.user;
});

export const register = createAsyncThunk("auth/register", async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data.user;
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => (state.user = action.payload))
      .addCase(register.fulfilled, (state, action) => (state.user = action.payload));
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
