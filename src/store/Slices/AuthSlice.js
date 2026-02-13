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
    },

    // updateLogin: (state, action) => {
    //   state.data = {
    //     ...state.data,
    //     fullName: action.payload.fullName || state.data.fullName,
    //     email: action.payload.email || state.data.email,

    //     Bio: action.payload.Bio || state.data.Bio,
    //     gender: action.payload.gender || state.data.gender,
    //     Dob: action.payload.Dob || state.data.Dob,

    //     Availiblity: Array.isArray(action.payload.Availiblity)
    //       ? action.payload.Availiblity
    //       : state.data.Availiblity,
    //     Hourlyrate: action.payload.Hourlyrate || state.data.Hourlyrate,
    //     Speciality: Array.isArray(action.payload.Speciality)
    //       ? action.payload.Speciality
    //       : state.data.Speciality,
    //     Address: action.payload.Address || state.data.Address,
    //     profileImage: action.payload.profileImage || state.data.profileImage,
    //   };
    // },

    // updateLogin: (state, action) => {
    //   state.data = action.payload;
    // },

    updateLogin: (state, action) => {
      state.data = {
        ...state.data,
        ...action.payload,
      };
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
export const {IsLogin, SignOut, ForgetPasswordID, SaveEmail, updateLogin} =
  authSlice.actions;
export default authSlice.reducer;
