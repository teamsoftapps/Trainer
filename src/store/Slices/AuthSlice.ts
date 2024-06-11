import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
};

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    IsLogin: (state, action) => {
      state.data = action.payload;
    },

    SignOut: (state, action) => {
      state.data = null;
    },
  },
});
export const {IsLogin, SignOut} = authSlice.actions;
export default authSlice.reducer;
