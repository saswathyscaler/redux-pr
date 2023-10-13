import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    currentPage: 1,
    projectsPerPage: 20, 
  },
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setProjectsPerPage: (state, action) => {
      state.projectsPerPage = action.payload;
    },
  },
});

export const { setCurrentPage, setProjectsPerPage } = paginationSlice.actions;
export default paginationSlice.reducer;
