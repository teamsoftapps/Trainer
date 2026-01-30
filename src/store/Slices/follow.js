import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  follow: [],
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    saveFollowers: (state, action) => {
      state.follow = action.payload;
    },
    removeFollowers: (state, action) => {
      state.follow = null;
    },
    followTrainer: (state, action) => {
      // Check if the trainer is already followed
      if (!state.follow.includes(action.payload)) {
        state.follow.push(action.payload); // Add trainerID to the array
      }
    },
    unfollowTrainer: (state, action) => {
      // Remove the trainerID from the follow array
      state.follow = state.follow.filter(
        trainerID => trainerID !== action.payload,
      );
    },
  },
});

export const {followTrainer, unfollowTrainer, saveFollowers, removeFollowers} =
  followSlice.actions;
export default followSlice.reducer;
