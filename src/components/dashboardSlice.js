import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "prjcts",
  initialState: {   
    items: [],
    paginate:[],
    isLoaded: false, 
  },
  reducers: {
    setPrjcts: (state, action) => {
      state.items = action.payload;
      state.isLoaded = true;
      
    },

    removePrjct: (state, action) => {
      state.items = state.items.filter(project => project.id !== action.payload);
    },


  },
});

export const { setPrjcts, removePrjct } = dashboardSlice.actions;
export default dashboardSlice.reducer;



