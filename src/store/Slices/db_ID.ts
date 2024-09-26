import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  dbId: null,
};

const dbId = createSlice({
  name: 'db_ID',
  initialState,
  reducers: {
    SaveLogedInUser: (state, action) => {
      state.dbId = action.payload;
    },
  },
});
export const {SaveLogedInUser} = dbId.actions;
export default dbId.reducer;
