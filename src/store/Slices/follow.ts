import {createSlice, PayloadAction} from '@reduxjs/toolkit';
interface FollowState {
  [trainerID: string]: boolean;
}

const initialState: FollowState = {};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    followTrainer: (state, action: PayloadAction<{trainerID: string}>) => {
      const {trainerID} = action.payload;
      state[trainerID] = true;
    },
    unfollowTrainer: (state, action: PayloadAction<{trainerID: string}>) => {
      const {trainerID} = action.payload;
      delete state[trainerID];
    },
  },
});

export const {followTrainer, unfollowTrainer} = followSlice.actions;
export default followSlice.reducer;
