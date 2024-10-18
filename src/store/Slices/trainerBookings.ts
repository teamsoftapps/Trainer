import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  Bookings: {},
};

const TrainerBookings = createSlice({
  name: 'Tainer Bookings',
  initialState,
  reducers: {
    saveBookings: (state, action) => {
      state.Bookings = action.payload;
    },
  },
});
export const {saveBookings} = TrainerBookings.actions;
export default TrainerBookings.reducer;
