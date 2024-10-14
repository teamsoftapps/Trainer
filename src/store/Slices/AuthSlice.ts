import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: null,
  res_ID: null,
  res_EMAIL: null,
  CUSTOMER_ID: null,
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
    ForgetPasswordID: (state, action) => {
      state.res_ID = action.payload;
    },
    SaveEmail: (state, action) => {
      state.res_EMAIL = action.payload;
    },
  },
});
export const {IsLogin, SignOut, ForgetPasswordID, SaveEmail} =
  authSlice.actions;
export default authSlice.reducer;
