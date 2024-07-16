import { createSlice } from '@reduxjs/toolkit';




const initialState = {
  currentAdmin: null,
  loading: false,
  error: '',
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = '';
    },
    signInSuccess: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = '';
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    signOut: (state) => {
      state.currentAdmin = null;
      state.loading = false;
      state.error = '';
    },
  },
});

export const { 
  signInStart, 
  signInSuccess, 
  signInFailure, 
  signOut 
} = adminSlice.actions;

export default adminSlice.reducer;
