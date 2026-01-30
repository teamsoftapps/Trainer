import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {};

const favouriteSlice = createSlice({
  name: 'favourite',
  initialState,
  reducers: {
    favouriteTrainer: (state, action) => {
      const {trainerID} = action.payload;
      state[trainerID] = true;
    },
    unfavouriteTrainer: (state, action) => {
      const {trainerID} = action.payload;
      delete state[trainerID];
    },
  },
});

export const {favouriteTrainer, unfavouriteTrainer} = favouriteSlice.actions;
export default favouriteSlice.reducer;
