import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../utils/api";

// Fetch all designs
export const fetchDesigns = createAsyncThunk("designs/fetchAll", async () => {
  const res = await API.get("/designs");
  return res.data;
});

// Save design
export const saveDesign = createAsyncThunk("designs/save", async (designData) => {
  const res = await API.post("/designs", designData);
  return res.data;
});

// Delete design
export const deleteDesign = createAsyncThunk("designs/delete", async (id) => {
  await API.delete(`/designs/${id}`);
  return id;
});

const designSlice = createSlice({
  name: "designs",
  initialState: {
    designs: [],
    currentDesign: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentDesign: (state, action) => {
      state.currentDesign = action.payload;
    },
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch designs
      .addCase(fetchDesigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = action.payload;
      })
      .addCase(fetchDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Save design
      .addCase(saveDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.designs.push(action.payload);
        state.currentDesign = action.payload;
      })
      .addCase(saveDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Delete design
      .addCase(deleteDesign.fulfilled, (state, action) => {
        state.designs = state.designs.filter(d => d._id !== action.payload);
      });
  }
});

export const { setCurrentDesign, clearCurrentDesign } = designSlice.actions;
export default designSlice.reducer;