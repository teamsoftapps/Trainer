import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  data: {},
  res_ID: null,
  res_EMAIL: null,
  CUSTOMER_ID: null,
};

const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    IsLogin: (state, action) => {
      console.log('Checking Redux', state.data);
      state.data = action.payload;
      console.log('Got Data', state.data);
    },

    updateLogin: (state, action) => {
      console.log('Dtaa Updated', state.data);
      state.data = {...state?.data, ...action.payload};
      console.log('After', state.data);
    },
    //   export const updateLoginData = (newData) => (dispatch, getState) => {
    //     const currentData = getState().login.data; // Access current state
    //     const updatedData = { ...currentData, ...newData }; // Merge data
    //     dispatch(IsLogin(updatedData)); // Dispatch action with merged data
    // };

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
export const {IsLogin, SignOut, ForgetPasswordID, SaveEmail, updateLogin} =
  authSlice.actions;
export default authSlice.reducer;
