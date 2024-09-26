import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface FollowState {
  [trainerID: string]: boolean;
}

const initialState: FollowState = {};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    favouriteTrainer: (state, action: PayloadAction<{trainerID: string}>) => {
      const {trainerID} = action.payload;
      state[trainerID] = true;
    },
    unfavouriteTrainer: (state, action: PayloadAction<{trainerID: string}>) => {
      const {trainerID} = action.payload;
      delete state[trainerID];
    },
  },
});

export const {favouriteTrainer, unfavouriteTrainer} = favouriteSlice.actions;
export default favouriteSlice.reducer;
