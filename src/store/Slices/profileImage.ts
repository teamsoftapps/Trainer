import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  PROFILE_IMAGE: null,
};

const profileImage = createSlice({
  name: 'Image',
  initialState,
  reducers: {
    saveProfileImage: (state, action) => {
      state.PROFILE_IMAGE = action.payload;
    },
  },
});
export const {saveProfileImage} = profileImage.actions;
export default profileImage.reducer;
